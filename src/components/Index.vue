<template>
  <!-- 布局容器 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 头部logo和标题区域 -->
      <div>
        <img @click="toIndex" src="../assets/index.jpg" alt />
        <span>小说管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <!-- 控制侧边栏收缩和展开 -->
        <div class="menuCollapse" @click="collapseMenu">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          router
          ref="asideMenuRef"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activeMebuIndex"
          @open="openMenu"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+itemsub.path"
              v-for="itemsub in item.children"
              :key="itemsub.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemsub.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体区域 -->
      <el-main>
        <!-- 面包屑导航区域 -->
        <Breadcrumb></Breadcrumb>
        <!-- 主体内容 -->
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
      // 侧边栏菜单数据
      menus: [],
      // 控制侧边栏是否收缩 true: 收缩 false: 展开
      isCollapse: false,
      // 一级菜单前的小图标对象
      iconObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      // 当前激活的菜单的 index
      activeMebuIndex: ""
    };
  },
  components: {
    Breadcrumb
  },
  watch: {
    $route(val) {
      // 获取路由对象中保存的被激活菜单的index
      this.activeMebuIndex = val.params.activeMebuIndex;
      this.useCloseMenu();
    }
  },
  methods: {
    // 获取侧边栏菜单数据
    async getMenus() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menus = res.data;
      console.log(this.menus);
    },
    // 用户退出功能
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 点击logo回到欢迎页
    toIndex() {
      this.$router.push("/index");
    },
    // 控制侧边栏收缩和展开
    collapseMenu() {
      this.isCollapse = !this.isCollapse;
    },
    // 展开菜单时保存被展开菜单的index
    openMenu(index, path) {
      // 把当前展开的菜单的 index 保存到sessionStorage中
      sessionStorage.setItem('expandMebuIndex',index);
    },
    // 收起指定的菜单
    closeMenu() {
      this.$nextTick(() => {
        const expandMebuIndex = sessionStorage.getItem('expandMebuIndex');
        this.$refs.asideMenuRef.close(expandMebuIndex);
      });
    },
    useCloseMenu() {
      // 如果被激活菜单的index为 /welcome 则收起之前展开的菜单
      if (this.activeMebuIndex === "/welcome") {
        this.closeMenu();
      }
    }
  },
  created() {
    this.getMenus();
    // 获取路由对象中保存的被激活菜单的index
    this.activeMebuIndex = this.$route.params.activeMebuIndex;
    this.useCloseMenu();
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