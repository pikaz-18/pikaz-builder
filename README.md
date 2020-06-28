<!--
 * @Author: zouzheng
 * @Date: 2020-06-22 17:48:54
 * @LastEditors: zouzheng
 * @LastEditTime: 2020-06-28 14:36:34
 * @Description: 这是XXX组件（页面）
--> 
# 前端自动化打包部署

## api接口启动
如果全局安装pm2，则
```bash
cd /api
npm run dev
```
如果没安装pm2，则
```bash
cd /api
node app.js
```

## 项目管理界面启动
```bash
cd /admin
npm install 
npm run serve
```

## 使用
启动api服务，启动项目管理界面。

界面输入框中分别输入:

项目名称：pikaz-excel-js

项目git地址：https://github.com/pikaz-18/pikaz-excel-js.git

项目路径：D:\

打包命令：npm run build

点击添加，即可在D盘下载打包一个pikaz-excel-js插件项目

### 接口文档

端口为3000，本地可访问http://127.0.0.1:3000

接口|请求方式|说明|参数
-|-|-|-
/add|POST|添加项目|function({name:"项目名称", git:"项目git地址", path:"项目创建路径", build:"项目打包命令"})
/edit|POST|修改项目（项目名称不可修改，如需修改，请先删除再添加）|function({name:"项目名称", git:"项目git地址", path:"项目路径", build:"项目打包命令"})
/del|POST|删除项目|function({name:"项目名称"})
/list|POST|查询项目列表|function()
/build|POST|构建项目|function({name:"项目名称"})

### 说明

1、如使用cnpm,yarn等，只需在接口文件app.js中将npm命令置换为cnpm或yarn命令。

2、本项目的操作命令行只针对win系统，如在linux系统下运行，只需将rd/s/q删除替换为rm -rf。

3、本项目仅提供最简实现，如需其他操作，可自己实现。

