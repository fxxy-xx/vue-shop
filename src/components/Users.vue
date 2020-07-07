<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card" >
            <!-- 搜索添加区域 -->
            <el-row :gutter="20">
                <el-col :span='8'>
                    <div>
                        <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span='4'> 
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!--表格区域-  -->
            <el-table stripe border :data="userList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='180px'>
                    <template slot-scope="scope" >
                        <el-row>
                            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                <el-button @click="showSetRole(scope.row)"  type="warning" icon="el-icon-setting" size="mini" ></el-button>
                            </el-tooltip>                            
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--  分页区域-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1,2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClose">
            <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" type="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>  
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>  
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>                 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="addUser" >确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input  v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item  label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户权限对话框 -->
        <el-dialog title="修改权限" :visible.sync="setRoleDialogVisible">
            <el-form>
               <div>
                   <p>当前用户名：{{setRoleForm.username}}</p>
                    <p>当前角色：{{setRoleForm.role_name}}</p>
                    <p>
                        分配角色
                        <el-select v-model="roleId" placeholder="请选择">
                            <el-option v-for="item in roleList"  :key="item.id" :label="item.roleName"  :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
               </div>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRoleId">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {

    data() {
        //检查邮箱
        var checkEmail=(rule,value,cb)=>{
            //验证邮箱的正则表达式
            const regEmail = /^([a-aZ-Z0-9_-])+@([a-aZ-Z0-9_-])+(\.[a-aZ-Z0-9_-])+/;

            if (regEmail.test(value)) {
                return cb();               
            }
            cb()
        };
        //检查手机号
        var checkMobile=(rule,value,cb)=>{
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

            if (regMobile.test(value)) {
                 return cb();                
            }
            cb(new Error("请输入合法的手机号"))
        };

        return {
            //获取用户列表的请求参数
            queryInfo:{
                query:'',
                pagenum: 1,
                //当前每页显示多少条数据
                pagesize: 2
            },
            userList:[],
            total:0,
            //添加用户对话框
            addDialogVisible:false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''

            },          
            //添加表单的验证规则对象
            formRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail,trigger:'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur' }
                ]

            },
            //修改用户对话框显示
            editDialogVisible:false,
            //查询道德用户信息对象
            editForm:{},
            setRoleDialogVisible:false,
            setRoleForm:[],
            roleList:[],
            roleId:''

     
        }
    },
    created() {
        this.getUserList();
        
    },
    methods: {
        async getUserList(){
          const {data: res} =await this.$http.get('users',{params:this.queryInfo})
          //console.log(res)
          if (res.meta.status !== 200) this.$message.error("获取用户列表失败！");

          this.userList = res.data.users;
          this.total = res.data.total;
        },
        //监听pagesize（每页显示数量）改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getUserList();
            //console.log(newSize);
        },
        //监听页码值改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getUserList();
           // console.log(newPage)
        },
        //更新状态
        async userStateChange(userinfo){
            
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            //console.log(res)
            if(res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error("更新状态失败！");
            } 

            this.$message.success("更新状态成功!");
            


        },
        //
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return;
                //可以发起网络请求
                const {data:res} = await this.$http.post('users',this.addForm);
                if (res.meta,status !== 201) {
                    this.$message.error("添加用户失败！");    
                }
                this.$message.success("添加用户成功！");
                this.addDialogVisible = false;
                this.getUserList();
            }

            )

        },
        //展示编辑用户的对话框
        async showEditDialog(id){
           const {data:res} = await this.$http.get('users/'+id);
           if (res.meta.status !== 200) {
               return this.$message.error("查询用户信息失败！");
           }
           //console.log(res)
           this.editForm = res.data;
           //console.log(this.editForm)
           this.editDialogVisible = true;           
        },
        //
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()           
        },

        //修改用户信息
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return;

                //通过发起修改用户信息请求
                const {data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile});
                if(res.meta.status !== 200) return this.$message.error("更新用户失败！");
                //关闭对话框
                this.editDialogVisible = false;
                //更新用户列表
                this.getUserList();
                //提示更新成功
                this.$message.success("更新用户数据成功！");
            })
        },
        //根据ID删除对应的用户
        async removeUserById(id){
            //弹框询问客户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err);
            //判断用户是否删除
            if(confirmResult !== 'confirm'){
                return this.$message.info("已取消删除！");
            }
            //删除用户
            const {data:res} = await this.$http.delete('users/'+id);
            if(res.meta.status !== 200) return this.$message.error("删除用户失败！");
            this.$message.success("删除用户成功！");
            this.getUserList();
        

        },
        async showSetRole(user){
            
            this.setRoleForm = user;
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status !== 200) return this.$message.error("获取权限列表失败");

            this.roleList = res.data;

            console.log(this.roleList)

            this.setRoleDialogVisible = true
        },
        async setRoleId(){

            //setRoleId 角色ID
            //setRoleForm  当前用户的详细信息
            //console.log(this.roleId)

            const {data:res} = await this.$http.put(`users/${this.setRoleForm.id}/role`,{rid:this.roleId});
            //console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);

            this.$message.success(res.meta.msg);
            this.setRoleDialogVisible = false;
            this.getUserList();


        }
        

  


        
    },
    
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    font-size: 14px;
    margin-top: 10px;
}
.el-card{
    margin-top: 20px;
}
.el-table{
    font-size: 12px;
    margin-top: 20px;
}

</style>