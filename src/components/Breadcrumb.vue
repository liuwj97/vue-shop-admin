<template>
  <!-- 面包屑导航组件 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-if="item.meta.title"
      :to="{ path: item.path }"
      :key="item.path"
      v-for="item in breadcrumbList"
    >
      <span class="breadcrumb-link">{{item.meta.title}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      // 导航数据数组
      breadcrumbList: []
    };
  },
  methods: {
    // 获取导航数据
    getBreadcrumb() {
      // this.$route.matched 是一个数组，包含当前路由的所有嵌套路径片段的路由记录
      this.breadcrumbList = this.$route.matched.filter(item => item.name);
      console.log(this.breadcrumbList);
    }
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
    // 侦听路由对象变化重新获取导航数据
    $route() {
      this.getBreadcrumb();
    }
  }
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.breadcrumb-link {
  cursor: pointer;
}
</style>