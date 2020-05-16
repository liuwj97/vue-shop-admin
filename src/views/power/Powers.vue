<template>
  <!-- 卡片视图 -->
  <el-card class="box-card">
    <!-- 权限列表数据表格展示 -->
    <el-table :data="powerData" max-height="500" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" prop="authName" label="权限名称"></el-table-column>
      <el-table-column align="center" prop="path" label="路径"></el-table-column>
      <el-table-column align="center" prop="level" label="权限等级">
        <!-- 渲染权限等级标签 -->
        <!-- #default 相当于 v-slot -->
        <template #default="{row}">
          <el-tag v-if="row.level === '0'">一级</el-tag>
          <el-tag v-else-if="row.level === '1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      powerData: []
    };
  },
  created() {
    this.getPowerData();
  },
  methods: {
    // 获取权限列表数据
    async getPowerData() {
      const { data: res } = await this.$axios.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.powerData = res.data;
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
</style>