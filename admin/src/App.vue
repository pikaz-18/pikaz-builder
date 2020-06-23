<!--
 * @Author: zouzheng
 * @Date: 2020-06-22 17:48:49
 * @LastEditors: zouzheng
 * @LastEditTime: 2020-06-23 11:42:10
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
          <input v-model="item.name">
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
    <div class="loading" v-show="loading">
      <transition name="el-fade-in-linear">
        <div class="loading-item">加载中</div>
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
      api: "http://192.168.0.173:3000",
      loading: false
    }
  },
  methods: {
    /**
     * @name: 构建
     * @param {type} 
     * @return: 
     */
    build (index) {
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: this.addProject, // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).catch(
        err => {

        })
    },
    edit (index) {

    },
    del (index) {

    },
    add () {
      console.log(this.addProject)
      fetch(`${this.api}/add`, {
        method: 'POST', // or 'PUT'
        body: { ...this.addProject }, // data can be `string` or {object}!
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
      }).catch(
        err => {

        })
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
  width: 100px;
  height: 40px;
  background: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin: 30vh auto;
}
</style>
