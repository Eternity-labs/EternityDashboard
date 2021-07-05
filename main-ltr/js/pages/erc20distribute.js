//[Dashboard Javascript]

//Project:	DashboardX Admin - Responsive Admin Template
//Primary use:   Used only for the main dashboard (index.html)
document.write("<script language=javascript src='./js/api.js'></script>");
document.write("<script language=javascript src='http://at.alicdn.com/t/font_2612700_uzdaq5d2kzd.js'></script>");
$(function () {

    getErc20Distribute();

    'use strict';

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

}); // End of use strict

/**
 * 获取erc20链上代币的分布情况
 */
function getErc20Distribute() {
    //erc20链上代币的分布情况
    // 获取数据
    $.ajax({
        type: "GET",
        url: baseUrl + "/token/substrate/erc20distribute",
        cache: false, //禁用缓存
        data: {
        }, //传入组装的参数
        dataType: "json",
        success: function (result) {
            var erc20Data = [];
            erc20Data = result;

            //根据数据长度设置颜色
            var colorList = ['#689f38', '#38649f', '#389f99', '#ee1044', '#ff8f00'];
            // var colorList = [];
            // for (let i = 0; i < 50; i++) {
            // 	colorList[i] = getColor();
            // }

            //erc20链上代币的分布情况
            //计算百分比
            var totalNum = 0;
            for (let i = 0; i < erc20Data.length; i++) {
                totalNum += parseInt(erc20Data[i].Num);
            }
            var tempData = [];
            for (let i = 0; i < erc20Data.length; i++) {
                var temp = [];
                // temp.push((i + 1));
                temp.push(erc20Data[i].address);
                temp.push(erc20Data[i].Num);
                temp.push((Math.round(erc20Data[i].Num / totalNum * 1000000) / 10000) + "%");
                tempData[i] = temp;
            }
            //设置表格
            $('#erc20distributeTable').DataTable({
                "data": tempData,
                "paging": true,
                "ordering": true,
                "info": true,
                "searching": true,
                "lengthMenu": [[4, 8, 16, -1], [4, 8, 16, "All"]],
                "pagingType": "full_numbers",
            });

            //设置erc20链上代币的分布情况的饼状图
            var erc20distributepieChart = echarts.init(document.getElementById('erc20distribute-pie'));
            var optionpie = {
                // Add title
                title: {
                    text: 'erc20链上代币的分布情况-饼状图',
                    x: 'center'
                },

                // Add tooltip
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },

                // Add legend
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    // data: ['Direct Access', 'Mail Marketing', 'Union ad', 'Video ad', 'Search Engine']
                },

                // Add custom colors
                color: colorList,

                // Display toolbox
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    feature: {
                        mark: {
                            show: true,
                            title: {
                                mark: 'Markline switch',
                                markUndo: 'Undo markline',
                                markClear: 'Clear markline'
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title: 'View data',
                            lang: ['View chart data', 'Close', 'Update']
                        },
                        magicType: {
                            show: true,
                            title: {
                                pie: 'Switch to pies',
                                funnel: 'Switch to funnel',
                            },
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    y: '20%',
                                    width: '50%',
                                    height: '70%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {
                            show: true,
                            title: 'Restore'
                        },
                        saveAsImage: {
                            show: true,
                            title: 'Same as image',
                            lang: ['Save']
                        }
                    }
                },

                // Enable drag recalculate
                calculable: true,

                // Add series
                series: [{
                    name: 'Marketing',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '57.5%'],
                    data: [
                    ]
                }]
            };
            for (let i = 0; i < erc20Data.length; i++) {
                var temp = {};
                temp.name = erc20Data[i].address;
                temp.value = erc20Data[i].Num;
                optionpie.series[0].data[i] = temp;
            }
            erc20distributepieChart.setOption(optionpie);

            //设置erc20链上代币的分布情况的柱状图
            var erc20distributebarChart = echarts.init(document.getElementById('erc20distribute-bar'));
            var optionbar = {
                title: {
                    text: 'erc20链上代币的分布情况-柱状图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: true },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // legend: {
                // 	data: ['数量']
                // },
                xAxis: [
                    {
                        type: 'category',
                        name: 'Address',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                dataZoom: [{
                    type: 'inside'
                }],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Num',
                        // min: 0,
                        // max: 250,
                        // interval: 50,
                        axisLabel: {
                            formatter: '{value} 个'
                        }
                    },
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: [],
                        barWidth: 60,//柱图宽度
                        //配置样式
                        itemStyle: {
                            //通常情况下：
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color: function (params) {
                                    return colorList[params.dataIndex];
                                }
                            },
                        },
                    },
                ]
            };
            for (let i = 0; i < erc20Data.length; i++) {
                optionbar.xAxis[0].data.push(erc20Data[i].address);
                optionbar.series[0].data.push(erc20Data[i].Num);
            }
            erc20distributebarChart.setOption(optionbar);

            $(window).resize(function () {
                erc20distributepieChart.resize();
                erc20distributebarChart.resize();
            })


        },
    });
};