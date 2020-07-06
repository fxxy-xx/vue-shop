<template>
<div id='login_container'>
    
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avater_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 表单区域 -->
        <el-form ref="loginFromRef" class="login_form" :model="loginForm" :rules="loginFromRules">
            <!-- 输入用户名 -->
            <el-form-item prop='username'>
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 输入密码 -->
            <el-form-item prop='password'>
                <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type='password'></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button> 
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>

    </div>
</div>
    
</template>
<script>
export default {
    data(){
        return{
            //这是登录表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //验证规则
            loginFromRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        resetLoginForm(){
            this.$refs.loginFromRef.resetFields()
        },
    login(){
        this.$refs.loginFromRef.validate( async valid => {
            if(!valid) return;
            //发起请求
            const {data : res} = await this.$http.post('login',this.loginForm);
            //console.log(res.meta.status)
            //判断是否存在用户
            if(res.meta.status !== 200) return this.$message.error("登录失败！");
            this.$message.success("登录成功")
            //获取token并存储到sessionStorage中
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push('/home')




        })
    }
    },
    
}
</script>
<style scoped lang='less'>
#login_container{
    background-color: pink;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.avater_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #eee;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;

}
</style>