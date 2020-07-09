<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 上方搜索区域 -->
             <el-row>
                <el-col :span='8'>
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>  
            </el-row>
            
            <!-- 订单表格区域 -->
            <el-table :data="orderList" border stripe size="mini"> 
                <!-- 索引列 -->
                <el-table-column type="index"> </el-table-column>

                <!-- 订单编号列 -->
                 <el-table-column prop="order_number" label="订单编号" width="300px"> </el-table-column>

                 <!-- 订单价格 -->
                   <el-table-column prop="order_price" label="订单价格"> 
                       
                   </el-table-column>

                 <!-- 是否付款 -->
                   <el-table-column prop="order_pay" label="是否付款">
                       <template slot-scope="scope">
                           <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                           <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                       </template>
                       
                  </el-table-column>
                    <!-- 是否发货 -->
                   <el-table-column prop="is_send" label="是否发货"> </el-table-column>
                   <!-- 发货时间 -->
                   <el-table-column prop="create_time" label="发货时间">
                       <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}                       
                       </template>
                   </el-table-column>
                   <!-- 操作 -->
                   <el-table-column label="操作">
                       <template>
                           <el-button @click="showEditAddrDialog" icon="el-icon-edit" type="primary" size="mini"></el-button>
                           <el-button @click="showProgressBox" icon="el-icon-location" type="success" size="mini"></el-button>
                       </template>
                    </el-table-column>

            </el-table>

            <!-- 分页区域 -->

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 修改地址对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="editAddrDialogVisible"
                
                @close="editAddrDialogClose">
               <el-form ref="form" >
                    <el-form-item label="省市区/县">
                        <el-cascader
                        :options="cityData"                          
                        :props="{ expandTrigger: 'hover' }">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input></el-input>
                    </el-form-item>
               </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editAddrDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editAddrDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 物流进度对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
               
                @close="progressDialogClose">

                <el-timeline :reverse="false">
                    <el-timeline-item
                    v-for="(item, index) in progressData"
                    :key="index"
                    :timestamp="item.time">
                    {{item.context}}
                    </el-timeline-item>
                </el-timeline>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="progressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
                </span>
            </el-dialog>





        </el-card>
    </div>
</template>
<script>
import cityData from './citydata.js'

export default {
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderList:[],
            editAddrDialogVisible:false,
            cityData,
            progressVisible:false,
            progressData:{}
        }
    },
    created() {
        this.getOrderList(); 
            
    },
    methods: {
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.orderList = res.data.goods;
            //console.log(res)
            this.total = res.data.total;

        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();

        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderList();

        },
        showEditAddrDialog(){
            this.editAddrDialogVisible = true
        },
        editAddrDialogClose(){
            this.$refs.form.resetFields()

        },
        showEditAddrDialog(){
            this.editAddrDialogVisible = true

        },
        async showProgressBox(){
            //console.log(order_id)

            const {data:res} = await this.$http.get(`/kuaidi/1106975712662`)
            this.progressData = res.data
            //console.log(res)
            this.progressVisible = true
            //console.log(this.progressData)
        },
        progressDialogClose(){

        }
        



    },
    
}
</script>
<style lang="less" scoped>

</style>