<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>

            <div id="main" style="width: 800px;height:500px;"></div>

        </el-card>

    </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
    data() {
        return {
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            },           
     }
    },
    created() {
        
    },
    //dom元素渲染完毕
    async mounted() {
         // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res} = await this.$http.get('reports/type/1');
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        

        const result = _.merge(res.data,this.options)

       //展示图表
        myChart.setOption(result);
        
    },
    
}
</script>
<style lang="less" scoped>

</style>