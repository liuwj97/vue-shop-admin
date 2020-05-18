<template>
  <!-- 卡片视图 -->
  <el-card class="box-card">
    <!-- 添加角色按钮行 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRoleDialogOpen">添加角色</el-button>
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
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editRoleDialogOpen(row)"
          >编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(row)">删除</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-s-tools"
            @click="assignPowerDialogOpen(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      @close="assignPowerDialogClose"
      :visible.sync="assignPowerDialogVisible"
      width="50%"
      top="65px"
    >
      <!-- 主体区域 -->
      <el-tree
        :props="treeProps"
        node-key="id"
        :default-checked-keys="powerCheckedList"
        :data="powerList"
        ref="treeRef"
        :default-expand-all="true"
        show-checkbox
        :check-on-click-node="true"
      ></el-tree>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignPowerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignPower">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      roleData: [],
      // 控制添加角色对话框显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色的表单数据
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 添加角色表单数据验证规则
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "请填写角色描述",
            trigger: "blur"
          }
        ]
      },
      // 控制编辑角色对话框显示与隐藏
      editRoleDialogVisible: false,
      // 编辑角色的表单数据
      editRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑角色表单数据验证规则
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "请填写角色描述",
            trigger: "blur"
          }
        ]
      },
      // 所有权限列表
      powerList: [],
      // 控制分配权限对话框显示与隐藏
      assignPowerDialogVisible: false,
      // tree控件的配置选项
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的节点数组
      powerCheckedList: [],
      // 当前要分配权限的角色id
      roleId: ""
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
    },
    // 打开添加角色对话框
    addRoleDialogOpen() {
      this.addRoleDialogVisible = true;
    },
    // 添加角色对话框关闭时重置表单
    addRoleDialogClose() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 对表单数据进行预验证，通过后发起网络请求进行角色添加
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.getRoleData();
        this.addRoleDialogVisible = false;
      });
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm("此操作将永久删除该角色,是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`roles/${row.id}`);
          if (res.meta.status !== 200)
            return this.$message.error("删除角色失败");
          this.$message.success("删除角色成功");
          this.getRoleData();
        })
        .catch(err => {});
    },
    // 打开编辑角色对话框
    async editRoleDialogOpen(row) {
      const { data: res } = await this.$axios.get(`roles/${row.id}`);
      if (res.meta.status != 200)
        return this.$message.error("查询角色信息失败");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
      console.log(this.editRoleForm);
    },
    // 编辑角色对话框关闭时重置表单
    editRoleDialogClose() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 保存编辑后的角色数据
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `roles/${this.editRoleForm.roleId}`,
          this.editRoleForm
        );
        if (res.meta.status !== 200) return this.$message.error("编辑角色失败");
        this.$message.success("编辑角色成功");
        this.getRoleData();
        this.editRoleDialogVisible = false;
      });
    },
    // 打开分配权限对话框
    async assignPowerDialogOpen(row) {
      this.roleId = row.id;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.powerList = res.data;
      console.log(this.powerList);
      this.getCheckedPowerList(row, this.powerCheckedList);
      console.log(this.powerCheckedList);
      this.assignPowerDialogVisible = true;
    },
    // 关闭分配权限对话框
    assignPowerDialogClose() {
      this.powerList = [];
      this.powerCheckedList = [];
    },
    // 获取默认选中的节点数组
    getCheckedPowerList(role, ary) {
      // 如果不存在children属性则是三级节点
      if (!role.children) {
        return ary.push(role.id);
      }
      role.children.forEach(item => {
        this.getCheckedPowerList(item, ary);
      });
    },
    // 分配权限
    async assignPower() {
      var keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keys.join(",")
        }
      );
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("分配角色权限失败");
      this.$message.success("分配角色权限成功");
      this.getRoleData();
      this.assignPowerDialogVisible = false;
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
.el-dialog__wrapper {
  overflow: hidden;
}
</style>