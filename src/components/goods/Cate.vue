<template>
    <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-button type="primary" @click="showAddDialog">添加分类</el-button>
            </el-row>
            <!-- 显示分类表格区域 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border class="tree-table">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <li v-if="scope.row.cat_deleted === false" class="el-icon-success"></li>
                    <li class="el-icon-circle-close" v-else></li>
                </template>
                <!-- 排序渲染 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning"  v-if="scope.row.cat_level === 2">三级</el-tag>
                   
                </template>
                <!-- 操作列模板 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>

                </template>
                <!-- 分页-->                


            </tree-table>
            <!-- 分页显示区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10]"
                :page-size="queryInfo.pagesize"                
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加分类对话框 -->
            <el-dialog
                title="添加分类"
                @close="addCateDialogClosed"
                :visible.sync="addCateDialogVisible">
                <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
                    <el-form-item  label="分类名称:" prop="cat_name" >
                        <el-input  v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类:">
                          <el-cascader
                            props.checkStrictly
                            clearable
                            v-model="selectedKeys"
                            props.expandTrigger
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange"></el-cascader>
                        
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
            
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:3
            },
            total:0,
            columns:[
                {
                    label:"分类名称",
                    prop:'cat_name'
                   
                    
                },
                {
                    label:"是否有效",
                    type:"template",
                    template:"isok"

                },
                {
                    label:"排序",
                    //prop:"cat_level",
                    type:"template",
                    template:'order'

                },
                {
                    label:"操作",
                    type:"template",
                    template:'opt',                   
                }
            ],
            addCateDialogVisible:false,
            addCateFormRules:{
                cat_name:[
                     { required: true, message: '请输入分类名称', trigger: 'blur' },

                ]

            },
            addCateForm:{
                cat_name:'',
                //父级id
                cat_pid:'0',
                cat_level:'0'

            },
            parentCateList:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectedKeys:[]

        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList(){

            const {data:res} = await this.$http.get("categories",{params:this.queryInfo});
            //console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            //this.$message.success(res.meta.msg);

            this.cateList = res.data.result;
            this.total = res.data.total;
           //console.log(this.cateList)
        },
        //监听页码值改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList;
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        showAddDialog(){
            this.getParentCateList()

            this.addCateDialogVisible = true
        },
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})

            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.parentCateList = res.data

            //console.log(res)
        },
        parentCateChange(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length > 0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
                this.addCateForm.cat_level = this.selectedKeys.length;
                return;
            }
            else{
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
            

        },
         addCate(){

            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg);

                this.$message.success(res.meta.msg)
                this.getCateList();
                this.addCateDialogVisible = false;
               // console.log(res)
           })

            
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0; 
        }


    },
    
}
</script>
<style lang="less" scoped>
.el-card {
    margin-top: 20px;
}
.tree-table{
    margin-top: 20px;
}
.el-icon-success{
    color:lightgreen
}
.el-icon-circle-close{
    color:red
}
.tree-table {
    margin-top: 20px;
}
</style>