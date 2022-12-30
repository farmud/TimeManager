import type {CreatePlanForm, SearchPlanForm, UpdatePlanForm} from "~/utils/types.server";
import {prisma} from "~/utils/prisma.server";
import {json, redirect} from "@remix-run/node";
import {kmp, select} from "~/utils/algorithm.server";


export const createPlan = async (plan: CreatePlanForm) => {
    const newPlan = await prisma.plan.create({
        data: {
            userId: plan.userId,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            content: plan.content,
            parentId: plan.parentId
        },
    });

    if (newPlan)
        return redirect("/menubar");
    else
        return json({
            error: "创建失败", plan: {
                name: plan.name,
                startTime: plan.startTime,
                endTime: plan.endTime,
                content: plan.content,
                parent: plan.parentId,
                status: plan.status
            }
        }, {status: 500});
};

export const updatePlan = async (plan: UpdatePlanForm) => {
    const updatePlan = await prisma.plan.update({
        where: {
            id: plan.id
        },
        data: {
            userId: plan.userId,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            content: plan.content,
            parentId: plan.parentId
        },
    });
    if (updatePlan) {
        return redirect("/menubar");
    } else {
        return json({
            error: "更新失败", plan: {
                name: plan.name,
                startTime: plan.startTime,
                endTime: plan.endTime,
                content: plan.content,
                parent: plan.parentId,
                status: plan.status
            }
        }, {status: 500});
    }
}

export const deletePlan = async (id: string) => {
    const deletePlan = await prisma.plan.delete({
        where: {
            id: id
        }
    });
    if (deletePlan) {
        return redirect("/menubar");
    }
    return redirect("/menubar");
}

export const completePlan = async (id: string) => {
    const plan = await prisma.plan.findUnique({
        where: {
            id: id
        },
        select: {
            completed: true
        },
    });
    if (plan) {
        const newPlan = await prisma.plan.update({
            where: {
                id: id
            },
            data: {
                completed: !plan.completed
            },
        });
        if (newPlan) {
            return redirect("/menubar");
        } else {
            return json({
                error: "更新失败", plan: {
                    id: id,
                    completed: !plan.completed
                }
            }, {status: 500});
        }
    }
}

//获取所有任务
export const getPlans = async (userId: string) => {
    return await prisma.plan.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            startTime: 'asc'
        },
        select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
            status: true,
            content: true,
            parentId: true,
            completed: true
        }
    });
}

export const getPlansByType = async (userId: string, type: number) => {
    let plans = await getPlans(userId);
    return select(plans, (plan: any) =>
        type == judgeType(plan.status, plan.endTime))
}

//优先级
const judgeType = (status: number, EndTime: Date): number => {
    let nowTime = new Date();
    let isImportant;
    let isUrgent;
    let type: number;       //type表示所在象限

    isImportant = status > 1;
    isUrgent = Math.floor((EndTime.getTime() - nowTime.getTime()) / (24 * 3600 * 1000)) < 8;
    if (isImportant && isUrgent)
        type = 2;
    else if (isImportant && !isUrgent)
        type = 1;
    else if (!isImportant && isUrgent)
        type = 3;
    else type = 4;
    return type;
}

//以下为搜索算法（数据库无关）
//按条件搜索任务
export const searchPlans = async ({
                                      userId,
                                      id = undefined,
                                      name = undefined,
                                      startTime = undefined,
                                      endTime = undefined,
                                      status = undefined,
                                      content = undefined,
                                      parentId = undefined,
                                      children = true,//是否搜索子任务
                                      parent = false,//是否只搜索父任务
                                  }: SearchPlanForm) => {
    //获取所有任务
    let plans = await getPlans(userId);
    //如果传入id
    if (id) {
        //去除自身及子任务
        if (!children) plans = select(plans, (plan: any) => !getChildrenAndSelf(plans, id).includes(plan));
        if (parent) plans = getParents(plans, id);
        //按id搜索
        if (children && !parent) plans = select(plans, (plan: any) => kmp(plan.id, id));
    }
    //按名称搜索
    if (name) plans = select(plans, (plan: any) => kmp(plan.name, name));
    //按开始时间搜索
    if (startTime) plans = select(plans, (plan: any) => plan.startTime >= startTime);
    //按结束时间搜索
    if (endTime) plans = select(plans, (plan: any) => plan.endTime <= endTime);
    //按状态搜索
    if (status) plans = select(plans, (plan: any) => plan.status === status);
    //按内容搜索
    if (content) plans = select(plans, (plan: any) => kmp(plan.content, content));
    return plans;
}


//获取任务子树的集合
function getChildrenAndSelf<T>(plans: T[], id: string): T[] {
    let result: T[] = [];
    result.push(select(plans, (plan: any) => plan.id === id)[0]);
    let children = select(plans, (plan: any) => plan.parentId === id);
    for (let child of children)
        result = result.concat(getChildrenAndSelf(plans, child.id));
    return result;
}

//获取父任务的集合
function getParents<T>(plans: T[], id: string): T[] {
    let result: T[] = [];
    let self = select(plans, (plan: any) => plan.id === id)[0];
    if (self.parentId) {
        result.push(select(plans, (plan: any) => plan.id === self.parentId)[0]);
        result = result.concat(getParents(plans, self.parentId));
    }
    return result;
}