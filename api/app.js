/*
 * @Author: zouzheng
 * @Date: 2020-06-22 10:51:39
 * @LastEditors: zouzheng
 * @LastEditTime: 2020-06-24 10:59:44
 * @Description: 这是处理组件（页面）
 */
// Koa
const Koa = require('koa');
const app = new Koa();

// 跨域设置
const cors = require('koa2-cors');
app.use(cors());

// 路由
const Router = require('koa-router');
const router = new Router();

// 解析body
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const fs = require('fs');

const shell = require('pikaz-shell');

// 启动路由
app.use(router.routes()).use(router.allowedMethods())


/**
 * @name: 查询列表
 * @param {type} 
 * @return: 
 */
router.post('/list', async ctx => {
  const { project, nginx } = JSON.parse(fs.readFileSync('./base.json', 'utf-8'));
  ctx.body = { code: 200, data: { project, nginx }, message: '查询成功' };
})

/**
 * @name: 添加项目
 * @param {String} name/项目名称
 * @param {String} git/项目git地址
 * @param {String} path/项目所在文件夹位置
 * @param {String} build/打包命令
 * @return: 
 */
router.post('/add', async ctx => {
  const { name, git, path, build } = ctx.request.body
  ctx.body = { code: 500, data: { name, git, path, build }, message: '已存在相同名称的项目' };
  const data = JSON.parse(fs.readFileSync('./base.json', 'utf-8'));
  const gitProject = data.project.find(item => item.name === name)
  if (gitProject) {
    ctx.body = { code: 500, data: null, message: '已存在相同名称的项目' };
    return
  }
  // 工程文件名
  const n = git.split('/')
  const projectName = n[n.length - 1].replace('.git', '')
  // clone项目并安装依赖打包
  const result = await shell([{ cmd: [`git clone ${git}`], path }])
  if (result === true) {
    // 添加入配置中
    data.project.push({ name, git, path, projectName, build })
    fs.writeFileSync('./base.json', JSON.stringify(data))
    ctx.body = { code: 200, data: null, message: '添加成功' };
  } else {
    ctx.body = { code: 500, data: null, message: '添加失败' };
  }
})

/**
 * @name: 编辑
 * @param {String} name/项目名称
 * @param {String} git/项目git地址
 * @param {String} path/项目所在文件夹位置
 * @param {String} build/打包命令
 * @return: 
 */
router.post('/edit', async ctx => {
  const { name, git, path, build } = ctx.request.body
  const data = JSON.parse(fs.readFileSync('./base.json', 'utf-8'));
  const index = data.project.findIndex(item => item.name === name)
  if (index === -1) {
    ctx.body = { code: 500, data: null, message: `不存在${name}项目` };
    return
  } else {
    // 配置修改项目
    data.project[index] = { ...data.project[index], name, git, path, build }
    fs.writeFileSync('./base.json', JSON.stringify(data))
    ctx.body = { code: 200, data: null, message: '修改成功' };
  }
})

/**
 * @name: 删除
 * @param {String} name/删除项目的名称
 * @return: 
 */
router.post('/del', async ctx => {
  const { name } = ctx.request.body
  const data = JSON.parse(fs.readFileSync('./base.json', 'utf-8'));
  const index = data.project.findIndex(item => item.name === name)
  if (index === -1) {
    ctx.body = { code: 500, data: null, message: `不存在${name}项目` };
  } else {
    // 删除项目文件
    const project = data.project[index]
    const result = await shell([{ cmd: [`rd/s/q ${project.projectName}`], path: project.path }])
    if (result) {
      // 配置删除项目
      data.project.splice(index, 1)
      fs.writeFileSync('./base.json', JSON.stringify(data))
      ctx.body = { code: 200, data: null, message: '删除成功' };
      return
    }
    ctx.body = { code: 500, data: null, message: '删除失败' };
  }
})

/**
 * @name: 构建
 * @param {String} name/项目名称 
 * @return: 
 */
router.post('/build', async ctx => {
  const { name } = ctx.request.body
  // 查找项目
  const data = JSON.parse(fs.readFileSync('./base.json', 'utf-8'));
  const index = data.project.findIndex(item => item.name === name)
  if (index === -1) {
    ctx.body = { code: 500, data: null, message: `${name}项目文件不存在` };
  } else {
    const project = data.project[index]
    const path = `${project.path}/${project.projectName}`
    if (fs.existsSync(`${project.path}/node_modules`)) {
      // 存在node_modules则删除
      await shell([{ cmd: ["rd/s/q node_modules"], path }])
    }
    // 安装依赖打包
    const result = await shell([{ cmd: ["npm install", project.build], path }])
    if (result === true) {
      ctx.body = { code: 200, data: null, message: "build成功" };
    } else {
      ctx.body = { code: 500, data: null, message: "build失败" };
    }
  }
})

console.log("启动成功")

app.listen(3000);