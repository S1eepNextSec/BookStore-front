import EChartsReact from "echarts-for-react";
import {Card} from "antd";

export default function ColumnPlot({LabelVec,ValueVec,unit="",hint=""}){
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: `${hint}:{c} ${unit}`

        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: LabelVec,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel:{
                    show:true,
                    interval:0,
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '购买数量',
                type: 'bar',
                barWidth: '60%',
                data: ValueVec,
            }
        ]
    };
    return (
        <Card>
            <EChartsReact

                option={option}
            />
        </Card>
    )
}