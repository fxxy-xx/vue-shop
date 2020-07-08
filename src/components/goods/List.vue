<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 上方搜索区域 -->
            <el-row :gutter="20">
                <el-col :span='8'>
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable>
                        <el-button @click="handleSearchGood" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click="goAddPage" type="primary">
                            添加商品
                    </el-button>
                </el-col>               
            </el-row>

            <!-- 表格展示区域 -->
            <el-table :data="goodsList" border stripe  size="mini">
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- 展开列 -->
                <el-table-column label="商品名称" prop="goods_name" width="500px"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="50px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="50px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}                       
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button @click="deleGoodById(scope.row.goods_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页区域 -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <!-- 添加商品面板 -->
            <!-- <el-steps :active="active" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3"></el-step>
            </el-steps> -->

            
        </el-card>
    </div>    
</template>
<script>
export default {
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum: 1,
                pagesize: 5
            },
            total:0,
            goodsList:[],
            
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        async getGoodsList(){

            const {data:res } = await this.$http.get('goods',{params:this.queryInfo});
            
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            
            this.goodsList = res.data.goods
            this.total = res.data.total;

        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            console.log(this.queryInfo)

           this.getGoodsList()

        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        handleSearchGood(){
            this.getGoodsList()
        },
        async deleGoodById(good_id){

            const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            if(confirmRes !== 'confirm') return this.$message.info("取消删除操作。");

            const {data:res} = await this.$http.delete(`goods/${good_id}`);

            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);

            this.$message.success(res.meta.msg);
            this.getGoodsList()







        },
        goAddPage(){
            this.$router.push('/goods/add')
        }


    },
    
}
</script>
<style lang="less" scope>
.el-card{
    margin-top: 20px;
}
.el-table{
    margin-top: 15px;
}
    
</style>