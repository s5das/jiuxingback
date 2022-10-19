<template >
    <Tabbar></Tabbar>
    <div class="box1"></div>
    <div class="main">
        <div class="table-area">
            <div class="search-area">
                <div>测试结果查询</div>
                <div>
                    <el-select v-model="value" class="m-2" placeholder="Select">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div class="in">
                    <el-input v-model="input" placeholder="Please input" />
                </div>
                <div>
                    <el-button type="primary" round @click="search">查询</el-button>
                </div>
            </div>
            <table class="table">
                <thead>
                    <th>提交时间</th>
                    <th>测试结果</th>
                    <th>姓名</th>
                    <th>学号</th>
                    <th>大类</th>
                    <th>辅导员姓名</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in info_array" :key="item.id">
                        <td>{{item.time}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.stu_id}}</td>
                        <td>{{item.major}}</td>
                        <td>{{item.instructor}}</td>
                        <td>
                            <a href="javascript:#" @click.prevent="getDetail(index)">查看 </a>
                            <a href="javascript:#" @click.prevent="deleteIt(index)"> 删除</a>

                        </td>
                    </tr>
                </tbody>
            </table>

            <el-dialog v-model="dialogTableVisible">
                <div style="height:300px" ref="pic"></div>
                <div style="display:flex; height:100px;margin-top:30px;font-size: 15px;font-weight: 600;">
                    <div>测试结果：</div>
                    <div style="color:#4cb4f0;">{{type}}号 {{type_text[type-1]}}</div>
                </div>
            </el-dialog>

            <div class="pag">
                <div class="box">
                    <el-pagination background layout="prev, pager, next,jumper" :page-count="page_num"
                        @current-change="pageChange" v-model:current-page="page" />
                </div>
            </div>
            <div class="download-area">
                <el-button type="primary" round @click="getExcel">点击导出</el-button>
            </div>
        </div>

    </div>
</template>
<script>

import download from '@/utils/download'
import { getInfoByPage, deleteRecord, getInfoByFilter, getblob } from '@/http/api/backapi'
import Tabbar from '@/components/tabbar.vue';
import { ref, onMounted, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as echarts from 'echarts';
import question from '@/assets/question'
export default {
    name: "main-page",
    components: { Tabbar },

    setup() {
        const pic = ref()
        let info_array = ref([])
        let page_num = ref(0)
        let page = ref(1)
        let status = 0
        let type = ref()
        let type_text = ref([
            '完美主义者',
            '助人者',
            '成就者',
            '艺术型',
            '智慧型',
            '忠诚型',
            '快乐主义型',
            '领袖型',
            '和平型'
        ])
        onMounted(() => {
            getInfoByPage(page.value).then((res) => {

                info_array.value = res.data.data
                page_num.value = res.data.total
            })
        })

        const pageChange = () => {
            if (status === 0) {
                // 无条件
                getInfoByPage(page.value).then((res) => {
                    info_array.value = res.data.data
                })
            } else {
                // 有条件
                getInfoByFilter(input.value, page.value, value.value).then(
                    (res) => {
                        info_array.value = res.data.data

                    }
                )
            }

        }

        // 操作
        let dialogTableVisible = ref(false)
        const getDetail = (index) => {

            dialogTableVisible.value = true
            const temp_data = info_array.value[index].res
            const temp_data2 = info_array.value[index].detail_res
            type.value = info_array.value[index].type
            nextTick(() => { initChart(temp_data, temp_data2) })


        }
        const deleteIt = (index) => {
            ElMessageBox.confirm(
                '是否确认删除?',
                '确认删除',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    const id = info_array.value[index].id
                    deleteRecord(id).then(() => {
                        getInfoByPage(page.value).then((res) => {
                            info_array.value = res.data.data
                            page_num.value = res.data.total
                        })
                    })
                })

        }



        // 筛选
        let value = ref('')
        let input = ref('')
        const options = [
            {
                value: '学号',
                label: '学号',
            },
            {
                value: '姓名',
                label: '姓名',
            },
            {
                value: '辅导员',
                label: '辅导员',
            },
            {
                value: '大类',
                label: '大类',
            }
        ]
        const search = () => {
            if (value.value && input.value) {
                status = 1
                page.value = 1
                getInfoByFilter(input.value, page.value, value.value).then(
                    (res) => {
                        info_array.value = res.data.data
                        page_num.value = res.data.total
                    })
            }
        }
        const getquestion = (type, detail_res) => {
            let index = JSON.parse(detail_res)
            let que = []
            for (let i = 0; i < index.length; i++) {
                console.log('question[index[i]].type',question[index[i]].type);
                console.log('type',type);
                if (question[index[i]].type == type) {
                    que.push(index[i]+'.' + question[index[i]].question)
                }
            }
            return que
        }
        // 绘图
        var myChart = undefined
        const initChart = (res, detail_res) => {
            if (myChart) {
                myChart.dispose()
            }
            myChart = echarts.init(pic.value);

            var category = [
                "9",
                "8",
                "7",
                "6",
                "5",
                "4",
                "3",
                "2",
                "1"

            ];

            var barData = res.slice(0)
            barData.reverse()
            var option = {
                title: {
                    text: '测试数据',
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                    formatter: function (params) {
                        let str = ""
                        let que1 = getquestion(parseInt(params[0].axisValue),detail_res)
                        for(let i =0;i<que1.length;i++){
                           str += "<div>" + que1[i] + "</div>"
                        }
                        return str
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "value",
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                },
                yAxis: {
                    type: "category",
                    data: category,
                    splitLine: { show: false },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    offset: 10,
                    nameTextStyle: {
                        fontSize: 10,
                    },
                },
                series: [
                    {
                        name: "数量",
                        type: "bar",
                        data: barData,
                        barWidth: 14,
                        barGap: 10,
                        smooth: true,
                        label: {
                            normal: {
                                show: true,
                                position: "right",
                                offset: [5, -2],
                                textStyle: {
                                    color: "#333",
                                    fontSize: 13,
                                },
                            },
                        },
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 7,
                            },
                            normal: {
                                barBorderRadius: 7,
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    { offset: 0, color: "#3977E6" },
                                    { offset: 1, color: "#37BBF8" },
                                ]),
                            },
                        },
                    },
                ],
            };
            myChart.setOption(option);
            window.addEventListener("resize", function () {
                myChart.resize();
            })

        }
        const getExcel = () => {
            getblob().then(
                (res) => {
                    console.log(res);
                    download(res.data, 'application/excel', new Date().getTime() + '.xlsx')
                }
            )

        }



        return {
            info_array,
            page_num,
            pageChange,
            options,
            value,
            input,
            getDetail,
            deleteIt,
            search,
            page,
            dialogTableVisible,
            pic,
            type,
            type_text,
            getExcel
        }

    }
}
</script>
<style lang="less" scoped>
.pag {
    height: 80px;
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: flex-end;

    .box {
        margin-right: 50px;
    }
}

.box1 {
    height: 80px;
    background-color: #fff;
}

.main {

    .table-area {
        margin-top: 20px;
        height: 630px;
        position: relative;
        background-color: #fff;
        width: 90%;
        margin-left: 10%;
        padding-top: 20px;

        .download-area {
            position: absolute;
            top: 50px;
            left: 150px;

        }

        .search-area {
            height: 80px;
            display: flex;
            padding-right: 50px;
            justify-content: flex-end;
            align-items: center;
            position: relative;

            .in {
                width: 100px;
            }

            div {
                margin-right: 10px;
            }
        }

        .table {
            margin: 0 auto;
            width: 80%;
            border: 1px solid #000;
            border-spacing: 0;
            border-collapse: collapse;

            th,
            td {
                border: 1px solid #000;
                height: 40px;
                text-align: center;
            }

            a {
                text-decoration: none;
            }
        }

    }
}
</style>