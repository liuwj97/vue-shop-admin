<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头部logo区域 -->
      <div class="avatar">
        <img src="../assets/logo.jpg" alt />
      </div>
      <!-- 表单验证区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
            v-focus
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
         <!-- 密码输入框 -->
        <el-form-item prop="password">
          <!-- 监听原生键盘事件需要加上 native 修饰符-->
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            placeholder="密码"
            @keyup.enter.native="login"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 底部按钮区域 -->
        <el-form-item class="loginBtns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 登录表单验证规则
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
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
        ]
      }
    };
  },
  methods: {
    // 登录功能
    login() {
      // 登录表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error("用户名或密码错误");
        const { data: res } = await this.$axios.post("login", this.loginForm);
        if (res.meta.status != 200)
          return this.$message.error("用户名或密码错误");
        this.$message.success("登录成功");
        console.log(res);
        // 把服务器返回的token保存到sessionStorage中
        sessionStorage.setItem("token", res.data.token);
        // 跳转到欢迎页面
        this.$router.push("/index");
      });
    },
    // 重置表单
    restLoginForm() {
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-image: linear-gradient(to right bottom, #7f88fe, #9bffff);
}
.login-box {
  position: absolute;
  left: 50%;
  top: 50%;
  overflow: visible;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background-image: linear-gradient(to right bottom, #7f88fe, #9bffff);
  img {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 300px;
    border-radius: 20px;
  }
  .el-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .loginBtns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>>
