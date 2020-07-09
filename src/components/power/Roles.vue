<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                 <el-table-column type="expand">
                     <template slot-scope="scope">                        
                        <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bd-bottom',i1===0 ? 'bd-top':' '  ]" class="vcerter">  
                             <!-- 一级权限 -->
                            <el-col   :span='5'>
                                    <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                            </el-col>
                            
                             <el-col :span="19" >
                                  <!-- 二级权限 -->
                                 <el-row :class="[i2 ===0? ' ':'bd-top']" v-for="(item2,i2) in item1.children" :key="item2.id" class="vcerter">
                                        <!-- 二级权限 -->
                                         <el-col :span='6'>
                                             <el-tag @close="removeRightById(scope.row,item2.id)" type='success' closable>{{item2.authName}}</el-tag>
                                             <i class="el-icon-caret-right"></i>
                                         </el-col>
                                         
                                         <!-- 三级权限 -->
                                         <el-col :span="18">
                                                <el-tag @close="removeRightById(scope.row,item3.id)" v-for="item3 in item2.children" closable :key="item3.id" type="warning">
                                                    {{item3.authName}}
                                                </el-tag>
                                         </el-col>
                                 </el-row>

                             </el-col>
                            
                        </el-row>
                     </template>
                 </el-table-column>
               
                <el-table-column type="index"></el-table-column>

                <el-table-column prop="roleName" label="角色名称" ></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
          <!-- 修改权限列表对话框 -->
        <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree ref="treeRef" :data="rightsList"  :props="treeProps" show-checkbox :default-checked-keys="defKeys" node-key="id" default-expand-all>
            </el-tree>


            <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        return {
            rolesList:[],
            setRightDialogVisible:false,
            rightsList:[],
            //树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            defKeys:[],
            roleId:''

        }
    },
    created() {
        this.getRolesList();
    },
    methods: {
        async getRolesList(){

            const {data : res} = await this.$http.get('roles');
            if(res.meta.status !== 200) return this.$message.error("获取角色列表失败！");
            
            //this.$message.success("获取角色列表成功！");
            this.rolesList = res.data;

        },
        //根据id删除对应的权限
        async removeRightById(role,rightId){
            //弹框提示客户是否删除
             const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err )
                if(confirmResult !== 'confirm') return this.$message.info("取消了删除！");

                const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                //console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error("删除权限失败！");
                }
                this.$message.success("删除权限成功！");
                role.children = res.data;
        },
        async showSetRightDialog(role){    
            this.roleId = role.id;    
            //获取所有权限的数据
            const {data : res} = await this.$http.get('rights/tree ');
            if(res.meta.status !== 200) return this.$message.error("获取权限列表失败");
            this.rightsList = res.data;
            //console.log(this.rightsList)
            //递归获取jiedianid
            this.getLeakKeys(role,this.defKeys)
            
            this.setRightDialogVisible = true

        },
        //通过递归函数获取角色下所有三级权限的id
        //并保存在defkeys中
        getLeakKeys(node,arr){
            //当节点没有chridren属性时，则为第三节点，返回
            if(!node.children){
                return arr.push(node.id)
            }
            //利用递归获取三级节点的id
            node.children.forEach(element => {
                this.getLeakKeys(element,arr)
            });

        },
        //监听分配权限对话框
        setRightDialogClosed(){
            this.defKeys=[]

        },
        async allotRight(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            console.log(keys);
            const idStr = keys.join(',');

            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});

            if(res.meta.status !== 200) return this.$message.error('设置权限失败！');

            this.$message.success('分配权限成功！');

            this.getRolesList();
            this.setRightDialogVisible = false




        },

    

    },
    //展示修改权限的对话框
    
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
.el-table {
    margin-top: 20px;
}
.el-tag {
    margin: 5px;
}
.bd-top{
    border-top: 1px solid #eee;

}
.bd-bottom{
    border-bottom: 1px solid #eee;

}
.vcerter {
    display: flex;
    align-items: center;
}
</style>