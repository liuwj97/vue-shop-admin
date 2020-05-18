<template>
  <el-card class="box-card">
    <!-- 头部搜索区域 -->
    <div class="user-header">
      <!-- 搜索内容输入框 -->
      <el-input
        v-focus
        @keyup.enter.native="getUserData"
        @clear="getUserData"
        clearable
        placeholder="请输入搜索内容"
        v-model="keywords"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="addUserDialogOpen">添加用户</el-button>
    </div>
    <!-- 数据展示表格 -->
    <el-table :data="userData" border stripe style="width: 100%">
      <!-- 索引列 -->
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column align="center" prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column align="center" prop="role_name" label="角色" width="180"></el-table-column>
      <el-table-column align="center" prop="mg_state" label="状态">
        <!-- 通过作用域插槽获取行数据渲染状态列 -->
        <template v-slot="scope">
          <el-switch
            @change="userStateChange(scope)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350">
        <!-- 通过作用域插槽获取行数据渲染操作列 -->
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editUserDialogOpen(scope)"
          >编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope)">删除</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-s-tools"
            @click="assignRoleDialogOpen(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页区域 -->
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      :current-page="pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="editUserDialogClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDialogVisible"
      width="50%"
      @close="assignRoleDialogClose"
    >
      <!-- 主体区域 -->
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, val, callback) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailReg.test(val)) return callback(new Error("邮箱格式不正确"));
      callback();
    };
    // 手机验证规则
    var checkMobile = (rule, val, callback) => {
      const mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (!mobileReg.test(val)) return callback(new Error("手机格式不正确"));
      callback();
    };
    return {
      // 搜索关键词
      keywords: "",
      // 当前页
      pagenum: 1,
      // 每页显示数据条数
      pagesize: 5,
      // 数据总条数
      total: 0,
      // 用户数据列表
      userData: [],
      // 控制添加用户对话框是否打开 true: 打开 false: 关闭
      addUserDialogVisible: false,
      // 添加用户表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名在 2 到 10 个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码在 6 到 15 个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      // 控制编辑用户对话框是否打开 true: 打开 false: 关闭
      editUserDialogVisible: false,
      // 编辑用户表单数据
      editUserForm: {},
      // 编辑用户表单验证规则
      editUserFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      // 当前编辑用户的id
      editUserId: "",
      // 控制分配角色对话框是否打开
      assignRoleDialogVisible: false,
      // 当前要分配角色的用户信息
      userInfo: {},
      // 所有的角色列表
      roleList: [],
      // 选择的角色
      selectRole: ""
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    // 获取用户数据列表
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
    // 每页显示数据条数改变时触发
    pageSizeChange(size) {
      this.pagesize = size;
      this.getUserData();
    },
    // 页码(当前页)改变时触发
    currentPageChange(num) {
      this.pagenum = num;
      this.getUserData();
    },
    // 改变用户状态
    async userStateChange(scope) {
      console.log(scope);
      const { data: res } = await this.$axios.put(
        `users/${scope.row.id}/state/${scope.row.mg_state}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("设置用户状态失败");
      this.$message.success(res.meta.msg);
    },
    // 打开添加用户对话框
    addUserDialogOpen() {
      this.addUserDialogVisible = true;
    },
    // 添加用户对话框关闭时触发
    addUserDialogClose() {
      // 关闭对话框时重置表单
      this.$refs.addUserFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("users", this.addUserForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.addUserDialogVisible = false;
        this.getUserData();
      });
    },
    // 控制编辑用户对话框显示
    async editUserDialogOpen(scope) {
      this.editUserId = scope.row.id;
      this.editUserDialogVisible = true;
      const { data: res } = await this.$axios.get(`users/${this.editUserId}`);
      if (res.meta.status !== 200)
        return this.$message.erroe("查询用户信息失败");
      this.editUserForm = res.data;
      console.log(this.editUserForm);
    },
    // 编辑用户对话框关闭时触发
    editUserDialogClose() {
      // 关闭对话框时重置表单
      this.$refs.editUserFormRef.resetFields();
    },
    // 编辑用户
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editUserId);
        const { data: res } = await this.$axios.put(
          `users/${this.editUserId}`,
          this.editUserForm
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.editUserDialogVisible = false;
        this.getUserData();
      });
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            `users/${scope.row.id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功!");
          this.getUserData();
        })
        .catch(err => {});
    },
    // 打开分配角色对话框
    async assignRoleDialogOpen(row) {
      this.userInfo = row;
      // 获取所有的角色列表
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      console.log(this.roleList);
      this.assignRoleDialogVisible = true;
    },
    // 关闭分配角色对话框时触发
    assignRoleDialogClose() {
      this.selectRole = "";
    },
    // 分配角色
    async assignRole() {
      if (!this.selectRole) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$axios.put(
        `users/${this.userInfo.id}/role`,{rid: this.selectRole}
      );
      if (res.meta.status !== 200) return this.$message.error("分配角色失败");
      this.$message.success("分配角色成功");
      this.assignRoleDialogVisible = false;
      this.getUserData();
    }
  }
};
</script>

<style lang="less" scoped>
.user-header {
  display: flex;
  .el-input {
    flex: 0 1 30%;
    min-width: 376px;
    margin-right: 20px;
  }
}
.el-table {
  margin: 20px 0;
}
</style>