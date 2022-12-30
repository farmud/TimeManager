import {Echarts} from "~/components/planlist/echarts";
import type {EChartsOption} from "echarts";
import type {AoeRelationItemProps} from "~/components/aoe/aoe-relation-item";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import {useEffect, useState} from "react";

interface ChartProps {
    loaderData: any;
    actionData: any;
}

interface Point {
    id: string;
    name: string;
    depth: number;
}

interface Graph {
    points: Point[],
    depth: number,
    number: number[],
}

interface GPoint {
    name: string;
    x: number;
    y: number;
}

interface GGraph {
    source: string | number;
    target: string | number;
    value?: number;
    label?: {
        show: boolean,
        formatter: string,
        fontSize: number
    }
}

class Queue<T> {
    private data: Array<T> = new Array<T>();
    push = (item: T) => this.data.push(item);
    pop = (): T | undefined => this.data.shift();
}


export default function Chart({loaderData, actionData}: ChartProps) {
    const aoePlanList = actionData?.aoePlanList ? actionData.aoePlanList : loaderData.aoePlanList;
    const aoeRelationList = actionData?.aoeRelationList ? actionData.aoeRelationList : loaderData.aoeRelationList;

    const [points, setPoints] = useState(()=>{
        const init: GPoint[] = [];
        return init;
    })

    const [graph, setGraph] = useState(()=>{
        const init: GGraph[] =[];
        return init;
    })

    //初始化节点
    function getGraph() {
        function getHead(aoePlanItem: AoePlanItemProps): AoePlanItemProps {
            const temp = aoeRelationList.filter((item: AoeRelationItemProps) => item.childId === aoePlanItem.id);
            if (temp.length !== 0)
                return getHead(aoePlanList.filter((item: AoePlanItemProps) => item.id = temp[0].parentId))
            return aoePlanItem;
        }

        const q = new Queue<Point>();
        const graph: Graph = {points: [], depth: 0, number: []};
        let head = getHead(aoePlanList[0]);
        q.push({id: head.id, name: head.name, depth: 0})
        let temp: Point | undefined;
        while ((temp = q.pop()) !== undefined) {
            graph.points.push(temp);//节点入图
            graph.depth = temp.depth;
            const list = aoeRelationList.filter((item: AoeRelationItemProps) => item.parentId === temp!!.id)//子节点关系
            list.forEach((item: AoeRelationItemProps) => {
                const plan = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.childId)[0]//子节点
                q.push({id: plan.id, name: plan.name, depth: temp!!.depth + 1})
            })
        }

        //去重
        let tempPoints: Point[] = [];
        for (let i = graph.points.length - 1; i >= 0; i--)
            if (tempPoints.filter((point) => point.id === graph.points[i].id).length === 0)
                tempPoints.push(graph.points[i]);
        graph.points = []
        while ((temp = tempPoints.pop()) !== undefined) {
            graph.points.push(temp)
            if (!graph.number[temp.depth])
                graph.number.push(1);
            else
                graph.number[temp.depth]++;
        }
        return graph;
    }

    useEffect(() => {
        if (aoePlanList[0] && aoeRelationList[0] && points[0] === undefined && graph[0] === undefined) {
            var start = new Date().getTime();
            const graph: Graph = getGraph();
            let depth = -1, x = -300, max=0, temp = 0;
            graph.number.forEach((num)=>max = Math.max(num, max));//所有深度中的最大节点数
            let g_points: GPoint[] = [];

            graph.points.forEach((point)=>{
                if(point.depth !== depth){//深度变化
                    depth=point.depth
                    x+=300;
                    temp = (max - graph.number[depth]) / 2;
                }
                g_points.push({name:point.name,x,y:300*temp++});//生成节点的坐标
            })

            setPoints(g_points);//更新节点坐标
            let g_graph: GGraph[] = [];
            aoeRelationList.forEach((item: AoeRelationItemProps)=>{//生成边
                const parent: AoePlanItemProps = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.parentId)[0]
                const child: AoePlanItemProps = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.childId)[0]
                g_graph.push({
                    source: parent.name,
                    target: child.name,
                    value: item.day*24+item.hour,
                    label: {
                        show: true,
                        formatter: item.day+"天"+item.hour+"时",
                        fontSize: 10
                    }
                })
            });
            setGraph(g_graph);//更新边
            var end = new Date().getTime();
            console.log("生成图用时："+(end-start)+"ms");
        }
    },[aoePlanList, aoeRelationList])


    const option: EChartsOption = {
        title: {
            text: 'AOE 图'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: points,
                // links: [],
                links: graph,
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                }
            }
        ]
    }
    return (
        <>
            <div className="container w-full h-full">
                <Echarts option={option}/>
            </div>
        </>
    )
}