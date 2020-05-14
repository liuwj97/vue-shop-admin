<template>
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
      breadcrumbList: []
    };
  },
  methods: {
    getBreadcrumb() {
      this.breadcrumbList = this.$route.matched.filter(item => item.name);
      console.log(this.breadcrumbList);
    }
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
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