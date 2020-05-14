<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input @keyup.enter.native="getUserData" @clear="getUserData" clearable placeholder="请输入搜索内容" v-model="keywords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userData" border stripe style="width: 100%">
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column align="center" prop="mobile" label="电话"></el-table-column>
      <el-table-column align="center" prop="role_name" label="角色" width="180"></el-table-column>
      <el-table-column align="center" prop="mg_state" label="状态" width="180">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <el-tooltip :enterable="false" class="item" effect="dark" content="编辑用户" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip :enterable="false" class="item" effect="dark" content="删除用户" placement="top">
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
            <el-button size="mini" type="warning" icon="el-icon-s-tools"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      :current-page="pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      keywords: "",
      pagenum: 1,
      pagesize: 3,
      total: 0,
      userData: []
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    async getUserData() {
      const { data: res } = await this.$axios.get("users", {
        params: {
          query: this.keywords,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.userData = res.data.users;
      this.total = res.data.total;
      console.log(this.userData);
    },
    pageSizeChange(size) {
        this.pagesize = size;
        this.getUserData();
    },
    currentPageChange(num) {
        this.pagenum = num;
        this.getUserData();
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>