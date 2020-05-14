<template>
  <el-container>
    <el-header>
      <div>
        <img @click="toIndex" src="../assets/index.jpg" alt />
        <span>小说管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div class="menuCollapse" @click="collapseMenu">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          router
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="itemsub.path" v-for="itemsub in item.children" :key="itemsub.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemsub.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <Breadcrumb></Breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Breadcrumb from "./Breadcrumb";
export default {
  data() {
    return {
      menus: [],
      isCollapse: false,
      iconObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      }
    };
  },
  components: {
    Breadcrumb
  },
  methods: {
    async getMenus() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menus = res.data;
      console.log(this.menus);
    },
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    toIndex() {
      this.$router.push('/index');
    },
    collapseMenu() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMenus();
  }
};
</script>

<style lang="less" scoped>
.el-container,
.el-aside,
.el-main {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.el-aside {
  background-color: rgb(84, 92, 100);
  .menuCollapse {
    width: 100%;
    height: 25px;
    line-height: 25px;
    background: #3b424a;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eee;
}
.iconfont {
  margin-right: 5px;
}
</style>