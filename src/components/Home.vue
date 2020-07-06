<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout" class="logout">登出</el-button>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside  :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-bottom" @click="toggleCollance">&lt; &gt;</div>
                <el-menu background-color="#292929" text-color="#fff" unique-opened 
                :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
                    <!-- 一级菜单区域 -->
                    <el-submenu :index="' '+item.id" v-for="item in menulist" :key = "item.id">
                        <!-- 图标区域 -->
                        <template slot="title">
                        <i :class="iconsObj[item.id] " class="iconfont"></i>
                        <!-- 菜单文本区域 -->
                        <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单区域 -->
                        <el-menu-item @click="saveNavState(subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <!-- 二级菜单图标区域 -->
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <!-- 二级菜单菜单文本区域 -->
                            <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <!-- 主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
export default {
    data(){
        return{
            menulist:[],
            iconsObj:{
                125:'el-icon-user-solid',
                103:'el-icon-box',
                101:'el-icon-s-goods',
                102:'el-icon-s-order',
                145:'el-icon-data-line'
            },
            //菜单折叠
            isCollapse:false,
            //菜单地址高亮
            activePath:''

        }
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },

    methods: {
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data : res} = await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error("获取列表失败");
            this.menulist = res.data
            //console.log(res)
        },
        //点击按钮切换菜单折叠与展开
        toggleCollance(){
            this.isCollapse = !this.isCollapse

        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath;
        }
    },
    
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;

}
.el-header{
    padding: 20px;
    background-color: #292929;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    color: #fff;
    font-size: 22px;
    div{
        display: flex;
        align-items: center;
    }
    img{
        height: 60px;
        width: 60px;
        padding: 10px;
        margin: 10px;
        border-radius: 30%;
    }

}
.el-aside{
    background-color: #292929;
}
.el-main{
    background-color: #eeeeee;
}
.iconfont{
    margin-right: 10px;
}
.el-menu{
    border-right: none;
}
.toggle-bottom{
    color: #ffffff;
    background-color: #4a5064;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.1em;
    //鼠标放上去是小手
    cursor: pointer;

}

</style>