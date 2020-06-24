<!--
 * @Author: zouzheng
 * @Date: 2020-06-22 17:48:49
 * @LastEditors: zouzheng
 * @LastEditTime: 2020-06-24 11:13:35
 * @Description: 这是XXX组件（页面）
--> 
<template>
  <div id="app">
    <div class="logo">
      <img src="./assets/logo.png">
    </div>
    <div class="project">
      <h2>项目</h2>
      <!-- 编辑 -->
      <div class="project-item" v-for="(item,index) in projects" :key="item.name">
        <div>
          <span>项目名称：</span>
          <input v-model="item.name" disabled>
        </div>
        <div>
          <span>项目git地址：</span>
          <input v-model="item.git">
        </div>
        <div>
          <span>项目路径：</span>
          <input v-model="item.path">
        </div>
        <div>
          <span>打包命令：</span>
          <input v-model="item.build">
        </div>
        <div>
          <div class="btn" @click.stop="build(index)">构建</div>
          <div class="btn" @click.stop="edit(index)">编辑</div>
          <div class="btn" @click.stop="del(index)">删除</div>
        </div>
      </div>
      <!-- 添加 -->
      <div class="project-item">
        <div>
          <span>项目名称：</span>
          <input v-model="addProject.name">
        </div>
        <div>
          <span>项目git地址：</span>
          <input v-model="addProject.git">
        </div>
        <div>
          <span>项目路径：</span>
          <input v-model="addProject.path">
        </div>
        <div>
          <span>打包命令：</span>
          <input v-model="addProject.build">
        </div>
        <div>
          <div class="btn" @click.stop="add">添加</div>
        </div>
      </div>
    </div>
    <div class="loading" v-show="loading.show">
      <transition name="el-fade-in-linear">
        <div class="loading-item">{{loading.text}}</div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      // 项目配置
      projects: [],
      // 新增项目
      addProject: { name: "", git: "", path: "", build: "" },
      // api地址
      api: "http://127.0.0.1:3000",
      loading: {
        text: "加载中",
        show: false
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /**
     * @name: 获取项目列表
     * @param {type} 
     * @return: 
     */
    getList () {
      fetch(`${this.api}/list`, {
        method: 'POST',
      }).then(res => {
        res.json().then(data => {
          if (data.code === 200) {
            this.projects = data.data.project
          } else {
            this.message(data.message)
          }
        })
      }).catch(err => {
        console.log(err)
        this.message(err)
      })
    },
    /**
     * @name: 构建
     * @param {type} 
     * @return: 
     */
    build (index, name) {
      this.loadingOpen()
      fetch(`${this.api}/build`, {
        method: 'POST',
        body: JSON.stringify({ name: name || this.projects[index].name }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        res.json().then(data => {
          this.message(data.message)
        })
      }).catch(err => {
        console.log(err)
        this.message(err)
      })
    },
    /**
     * @name: 编辑
     * @param {type} 
     * @return: 
     */
    edit (index) {
      this.loadingOpen()
      fetch(`${this.api}/edit`, {
        method: 'POST',
        body: JSON.stringify(this.projects[index]),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        res.json().then(data => {
          if (data.code === 200) {
            this.build(index)
          }
          this.message(data.message)
        })
      }).catch(err => {
        console.log(err)
        this.message(err)
      })
    },
    /**
     * @name: 删除
     * @param {type} 
     * @return: 
     */
    del (index) {
      this.loadingOpen()
      fetch(`${this.api}/del`, {
        method: 'POST',
        body: JSON.stringify({ name: this.projects[index].name }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        res.json().then(data => {
          if (data.code === 200) {
            this.getList()
          }
          this.message(data.message)
        })
      }).catch(err => {
        console.log(err)
        this.message(err)
      })
    },
    /**
     * @name: 添加
     * @param {type} 
     * @return: 
     */
    add () {
      this.loadingOpen()
      fetch(`${this.api}/add`, {
        method: 'POST',
        body: JSON.stringify(this.addProject),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        res.json().then(data => {
          if (data.code === 200) {
            this.build(-1, this.addProject.name)
            this.addProject = { name: "", git: "", path: "", build: "" }
            this.getList()
          } else {
            this.message(data.message)
          }
        })
      }).catch(err => {
        console.log(err)
        this.message(err)
      })
    },
    /**
     * @name: 提示信息 
     * @param {String} text/提示文字
     * @return: 
     */
    message (text) {
      this.loading = { show: true, text: text }
      setTimeout(() => {
        this.loading = { show: false, text: "加载中" }
      }, 1000)
    },
    /**
     * @name: loading显示
     * @param {type} 
     * @return: 
     */
    loadingOpen () {
      this.loading = { show: true, text: "加载中" }
    },
    /**
     * @name: loading关闭
     * @param {type} 
     * @return: 
     */
    loadingClose () {
      this.loading = { show: false, text: "加载中" }
    }
  },
}
</script>

<style>
#app {
  overflow: hidden;
}
.logo {
  width: 100vw;
  display: flex;
  border-bottom: 1px solid lightgray;
  padding-bottom: 10px;
}
.project {
  display: flex;
  flex-direction: column;
}
.project-item {
  display: flex;
}
.project-item > div {
  display: flex;
  margin-right: 10px;
  margin-bottom: 20px;
}
.btn {
  padding: 1px 10px;
  color: white;
  cursor: pointer;
  background: #f68e54;
  margin-left: 20px;
}
.loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
.loading-item {
  width: 200px;
  height: 40px;
  background: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin: 30vh auto;
}
</style>
