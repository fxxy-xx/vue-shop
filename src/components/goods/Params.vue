<template>
    <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row> 
                <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon>
                </el-alert>
            </el-row>

            <el-row class="opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange" props.expandTrigger></el-cascader>
                </el-col>
            </el-row>

            <el-row>
                <!-- 参数秒模板 -->
                <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <!-- 添加动态参数面板 -->
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" size="mini" :disabled="isBthDisabled" @click="addDialogVisible=true">
                            添加参数
                        </el-button>
                        <!-- 动态参数面板 -->
                        <el-table :data="manyTableData" border stripe>
                            <!-- 展开列 -->
                            <el-table-column type="expand" >
                                <template slot-scope="scope">
                                    <el-tag @close="handleTagClose(i,scope.row)" closable v-for="(item,i) in scope.row.attr_vals" :key="i"> {{item}} </el-tag>
                                    <!-- 输入的文本框 -->
                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>

                            <!-- 索引列 -->
                            <el-table-column type="index" index-text="#"></el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button  @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-tab-pane>
                    <!-- 静态属性面板 -->
                    <el-tab-pane label="静态属性" name="only" >
                        <el-button type="primary" size="mini" :disabled="isBthDisabled" @click="addDialogVisible=true">
                            添加属性
                        </el-button>
                        <!-- 静态参数表格 -->
                        <el-table :data="onlyTableData" border stripe>
                            <!-- 展开列 -->
                            <el-table-column type="expand" >
                                <template slot-scope="scope">
                                    <el-tag @close="handleTagClose(i,scope.row)" closable v-for="(item,i) in scope.row.attr_vals" :key="i"> {{item}} </el-tag>
                                    <!-- 输入的文本框 -->
                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>

                            <!-- 索引列 -->
                            <el-table-column type="index" index-text="#"></el-table-column>
                            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-card>


        <!-- 添加参数/属性对话框 -->
        <el-dialog :title="'添加'+titleText"  :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

            <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑参数对话框 -->
         <el-dialog :title="'修改'+titleText"  :visible.sync="editDialogVisible" width="50%" >

            <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClose">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>

        
    
    </div>

</template>

<script>
export default {
    data() {
        return {
            cateList:[],
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectedCateKeys:[],
            activeName:'many',
            paramsList:[],
            manyTableData:[],
            onlyTableData:[],
            addDialogVisible:false,
            addForm:{},
            formRules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },
            editDialogVisible:false,
            editForm:{},
            beforeEditParam:{},
            editParam:'',
            inputVisible:false,
            //tag输入的内容
            inputValue:''
            
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            //console.log(this.cateList)

        },
         async getParamsData(){

            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = [];
                this.manyTableData = [];
                this.onlyTableData=[]
                return;
            }
            //根据所选分类id及当前所在的面板，获取响应属性
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            //console.log(res.data)
           
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];

                item.inputVisible = false;
                item.inputValue = ''
                
            });

            // console.log(res.data)
            if(this.activeName === 'many'){
                this.manyTableData = res.data;
            }
           
            if(this.activeName === 'only'){
                this.onlyTableData = res.data;
            }
        },
        handleTabClick(){
            //console.log(this.activeName)
            this.getParamsData();
        },
        handleChange(){
            this.getParamsData();
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return;

                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName});

                if(res.meta.status !== 201) return this.$message.error(res.meta.msg);

                this.$message.success(res.meta.msg);
                this.getParamsData()
                this.addDialogVisible = false

            })
        },
        async showEditDialog(attr_id){
            
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}});
           // console.log(res);

            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            //this.editParam = res.data.attr_name
            this.editForm = res.data
           

            this.editDialogVisible = true



        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        editDialogClose(){
            //this.editForm.attr_name = this.beforeEditParam;
            this.editDialogVisible = false

        },

        editParams(){
            
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName});
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.editDialogVisible = false
                 this.getParamsData()
                this.editForm = res.data;
                //console.log(res)



            })

        },

        //根据属性ID删除对应属性                
        async removeParams(attr_id){
            const confirmRes = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).catch(err => err)

            if(confirmRes !== "confirm") {
                return this.$message.info("取消删除操作！");

            }
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);

            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            //console.log(res)
            this.$message.success(res.meta.msg);
            this.getParamsData()


        },
        //tag标签失去焦点。或者按下enter触发     
        async handleInputConfirm(row){

            //如果输入的内容为空，则不进行属性添加
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }

            //输入不为空，则进行添加操作
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue = ''
            row.inputVisible = false

            this.saveAttrVals(row)

           
                //this.getParamsData();
                //console.log(res)
            


        },
        async saveAttrVals(row){
             const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
                });

                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);

                this.$message.success(res.meta.msg);
        },
        showInput(row){
            row.inputVisible = true;

            //$nextTick当页面上的元素被重新渲染后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });

        },
        //删除对应的tag
        handleTagClose(i,row){
            row.attr_vals.splice(i,1);
            this.saveAttrVals(row);

        }
    },
    computed: {
        isBthDisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true;
            }
            return false
        },
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2];
            }
            return null;
        },
        titleText(){
            if(this.activeName === "many") return "动态参数";
            return "静态属性";
        }

    },
    
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 20px;
}
.opt{
    margin-top: 20px;
    font-size: 15px;
}
.el-table{
    margin-top: 20px;
}
.el-tag{
    margin: 8px;
}
.input-new-tag{
    width: 150px;
}

</style>