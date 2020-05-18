<template>
  <el-card class="box-card">
    <!-- 头部搜索区域 -->
    <div class="goods-header">
      <!-- 搜索内容输入框 -->
      <el-input
        v-focus
        @keyup.enter.native="getGoodsData"
        @clear="getGoodsData"
        clearable
        placeholder="请输入搜索内容"
        v-model="keywords"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="getGoodsData"></el-button>
      </el-input>
      <!-- 添加商品按钮 -->
      <el-button type="primary" @click="addGoods">添加商品</el-button>
    </div>
    <!-- 数据展示表格 -->
    <el-table :data="goodsData" border stripe style="width: 100%">
      <!-- 索引列 -->
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column
        align="center"
        prop="goods_name"
        label="商品名称"
        :show-overflow-tooltip="true"
        min-width="300px"
      ></el-table-column>
      <el-table-column align="center" prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column align="center" prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column align="center" prop="add_time" label="创建时间" min-width="150px">
        <template v-slot="{row}">{{row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <!-- 通过作用域插槽获取行数据渲染操作列 -->
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editGoodsDialogOpen(scope)"
          >编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(scope)">删除</el-button>
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
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
      @close="editGoodsDialogClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsFormRules"
        ref="editGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名" prop="goodsname">
          <el-input disabled v-model="editGoodsForm.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editGoodsForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editGoodsForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
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
      // 商品数据列表
      goodsData: [],
      // 控制编辑商品对话框是否打开 true: 打开 false: 关闭
      editGoodsDialogVisible: false,
      // 编辑商品表单数据
      editGoodsForm: {},
      // 编辑商品表单验证规则
      editGoodsFormRules: {
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
      // 当前编辑商品的id
      editGoodsId: ""
    };
  },
  created() {
    this.getGoodsData();
  },
  methods: {
    // 获取商品数据列表
    async getGoodsData() {
      const { data: res } = await this.$axios.get("goods", {
        params: {
          query: this.keywords,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.goodsData = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsData);
    },
    // 每页显示数据条数改变时触发
    pageSizeChange(size) {
      this.pagesize = size;
      this.getGoodsData();
    },
    // 页码(当前页)改变时触发
    currentPageChange(num) {
      this.pagenum = num;
      this.getGoodsData();
    },
    // 添加商品
    addGoods() {},
    // 控制编辑商品对话框显示
    async editGoodsDialogOpen(scope) {
      this.editGoodsId = scope.row.id;
      this.editGoodsDialogVisible = true;
      const { data: res } = await this.$axios.get(`goodss/${this.editGoodsId}`);
      if (res.meta.status !== 200)
        return this.$message.erroe("查询商品信息失败");
      this.editGoodsForm = res.data;
      console.log(this.editGoodsForm);
    },
    // 编辑商品对话框关闭时触发
    editGoodsDialogClose() {
      // 关闭对话框时重置表单
      this.$refs.editGoodsFormRef.resetFields();
    },
    // 编辑商品
    editGoods() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editGoodsId);
        const { data: res } = await this.$axios.put(
          `goodss/${this.editGoodsId}`,
          this.editGoodsForm
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.editGoodsDialogVisible = false;
        this.getGoodsData();
      });
    },
    // 删除商品
    deleteGoods(scope) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            `goods/${scope.row.goods_id}`
          );
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功!");
          this.getGoodsData();
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.goods-header {
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