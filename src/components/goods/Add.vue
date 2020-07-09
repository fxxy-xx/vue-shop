<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 消息提示 -->
            <el-alert
                title="添加商品信息"
                type="info"
                show-icon
                :closable="false"
                 center>
            </el-alert>
            <!-- 顶部步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>


            <!-- 左边步骤条 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" 
                @tab-click="tabClicked" tab-position="left" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0" >基本信息
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                             <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量"  prop="goods_weight">
                             <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                             <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                         <el-form-item label="商品分类" prop="goods_cat">
                             <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"                                
                                :props="cateProps"
                                @change="handleChange"
                               >
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="manyTableData.attr_name" v-for="item in manyTableData" :key="item.cat_id">

                        </el-form-item>


                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2" >商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeIndex:'0',
            addFormRules:{
                 goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
                 goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' },],
                 goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' },],
                 goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' },],
                 goods_cat:[{ required: true, message: '请选择商品分类', trigger: 'blur' },],
                
            },
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_cat:'',
                goods_number:0

            },
            cateProps:{
                expandTrigger: 'hover' ,
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            cateList:[],
            manyTableData:{}

        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            console.log(this.catList)


        },
        handleChange(){
            console.log(this.addForm.goods_cat)
            if(this.addForm.goods_cat.length !==3) this.addForm.goods_cat=[]
        },
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
               this.$message.error("请选择商品分类")
                return  false
            }
        },
        async tabClicked(){
            if(this.activeIndex === '1'){
                const {data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})
                //console.log(res)

                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.manyTableData = res.data;

                //console.log(res)
            }
        }
    },
    
}
</script>
<style lang="less" scoped>
.el-steps{
    margin-top: 20px
}
// .el-step__line{
//     font-size: 13px;

// }
.el-tabs{
    margin-top: 30px;
}
</style>