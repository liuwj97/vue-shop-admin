<template>
  <!-- 卡片视图 -->
  <el-card class="box-card">
    <!-- 添加角色按钮行 -->
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表数据表格展示 -->
    <el-table :data="roleData" max-height="500" stripe border style="width: 100%">
      <el-table-column type="expand">
        <!-- 渲染展开行的内容 -->
        <template #default="{row}">
          <!-- 渲染一级权限 -->
          <el-row class="vcenter border-b" v-for="item in row.children" :key="item.id">
            <el-col :span="6">
              <el-tag @close="closeTag(row,item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="18">
              <!-- 渲染二级权限 -->
              <el-row v-for="item1 in item.children" :key="item1.id">
                <el-col :span="6">
                  <el-tag @close="closeTag(row,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 渲染三级权限 -->
                  <el-tag
                    type="warning"
                    closable
                    @close="closeTag(row,item2.id)"
                    v-for="item2 in item1.children"
                    :key="item2.id"
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
      <el-table-column align="center" prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column align="center" label="操作">
        <!-- 渲染操作列按钮组 -->
        <!-- #default 相当于 v-slot -->
        <template #default="{row}">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-s-tools">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      roleData: []
    };
  },
  created() {
    this.getRoleData();
  },
  methods: {
    // 获取角色列表数据
    async getRoleData() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleData = res.data;
      console.log(res);
    },
    // 删除角色权限
    closeTag(role, rightId) {
      this.$confirm("此操作将永久从该角色中删除此项权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200)
            return this.$message.error("取消权限失败");
          this.$message.success(res.meta.msg);
          // 局部更新角色权限数据 防止页面刷新
          role.children = res.data;
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.border-b {
  border-bottom: 1px solid #eee;
}
</style>