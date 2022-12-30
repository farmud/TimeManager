import {prisma} from "~/utils/prisma.server";
import {redirect} from "@remix-run/node";
import type {
    CreateAoeGroupForm,
    CreateAoePlanForm,
    CreateAoeRelationForm,
    SearchAoeGroupForm,
    SearchAoePlanForm,
    UpdateAoeGroupForm,
    UpdateAoePlanForm
} from "~/utils/types.server";
import {kmp, select} from "~/utils/algorithm.server";

export class AoeGroup {
    //创建aoe组
    static create = async (aoeGroup: CreateAoeGroupForm) => {
        const newAoeGroup = await prisma.aOEGroup.create({
            data: {
                userId: aoeGroup.userId,
                name: aoeGroup.name,
                content: aoeGroup.content,
            },
        });
        if (newAoeGroup)
            return redirect("/menubar/aoe");
        else
            return redirect("/menubar/aoe?error=fail");
    }

    //删除aoe组
    static delete = async (id: string) => {
        const deleteAoeGroup = await prisma.aOEGroup.delete({
            where: {
                id: id
            }
        });
        if (deleteAoeGroup)
            return redirect("/menubar/aoe");
        else
            return redirect("/menubar/aoe?error=fail");
    }

    //修改aoe组
    static update = async (aoeGroup: UpdateAoeGroupForm) => {
        const updateAoeGroup = await prisma.aOEGroup.update({
            where: {
                id: aoeGroup.id
            },
            data: {
                userId: aoeGroup.userId,
                name: aoeGroup.name,
                content: aoeGroup.content,
            }
        });
        if (updateAoeGroup)
            return redirect("/menubar/aoe");
        else
            return redirect("/menubar/aoe?error=fail");
    }

    //获取aoe组
    static get = async (userId: string) => {
        return await prisma.aOEGroup.findMany({
            where: {
                userId: userId,
            },
            include: {
                AOE: true,
                AOEPlan: true,
            }
        });
    }

    //搜索aoe组
    static search = async (searchGroup: SearchAoeGroupForm) => {
        let aoeGroups = AoeGroup.get(searchGroup.userId);
        if (searchGroup.name) {
            aoeGroups = aoeGroups.then(groups => {
                return select(groups, (group: any) => kmp(group.name, searchGroup.name!!))
            });
        }
        return aoeGroups;
    }
}

export class AoePlan {
    //创建aoe节点
    static create = async (aoePlan: CreateAoePlanForm) => {
        const newAoePlan = await prisma.aOEPlan.create({
            data: {
                userId: aoePlan.userId,
                name: aoePlan.name,
                content: aoePlan.content,
                groupId: aoePlan.groupId
            },
        });
        if (newAoePlan)
            return redirect("/menubar/aoe?page=plans&groupId=" + aoePlan.groupId);
        else
            return redirect("/menubar/aoe?error=fail&page=plans&groupId=" + aoePlan.groupId);
    }
    //删除aoe节点
    static delete = async (id: string, groupId: string) => {
        const deleteAoePlan = await prisma.aOEPlan.delete({
            where: {
                id: id
            }
        });
        await prisma.aOE.deleteMany({
            where: {
                OR: [{parentId: id},
                    {childId: id}]
            }
        });
        if (deleteAoePlan)
            return redirect("/menubar/aoe?page=plans&groupId=" + groupId);
        else
            return redirect("/menubar/aoe?error=fail?page=plans&groupId=" + groupId);
    }
    //修改aoe节点
    static update = async (aoePlan: UpdateAoePlanForm) => {
        const updateAoePlan = await prisma.aOEPlan.update({
            where: {
                id: aoePlan.id
            },
            data: {
                userId: aoePlan.userId,
                name: aoePlan.name,
                content: aoePlan.content,
            }
        });
        if (updateAoePlan)
            return redirect("/menubar/aoe?page=plans&groupId=" + aoePlan.groupId);
        else
            return redirect("/menubar/aoe?error=fail&page=plans&groupId=" + aoePlan.groupId);
    }
    //获取aoe节点
    static get = async (userId: string, groupId: string) => {
        return await prisma.aOEPlan.findMany({
            where: {
                userId: userId,
                groupId: groupId,
            }
        });
    }
    //搜索aoe节点(数据库无关）
    static search = async (searchPlans: SearchAoePlanForm) => {
        //获取所有节点
        let aoePlans = AoePlan.get(searchPlans.userId, searchPlans.groupId);
        //按照名称搜索
        if (searchPlans.name) aoePlans = aoePlans.then(plans => {
            return select(plans, (plan: any) => kmp(plan.name, searchPlans.name!!))
        });
        return aoePlans;
    }
}

export class AoeRelation {
    //创建aoe关系
    static create = async (aoeRelation: CreateAoeRelationForm) => {
        const newAoeRelation = await prisma.aOE.create({
            data: {
                userId: aoeRelation.userId,
                groupId: aoeRelation.groupId,
                parentId: aoeRelation.parentId,
                childId: aoeRelation.childId,
                day: aoeRelation.day,
                hour: aoeRelation.hour,
                content: aoeRelation.content
            },
        });
        if (newAoeRelation)
            return redirect("/menubar/aoe?page=relations&groupId=" + aoeRelation.groupId);
        else
            return redirect("/menubar/aoe?error=fail&page=relations&groupId=" + aoeRelation.groupId);
    }
    //删除aoe关系
    static delete = async (id: string, groupId: string) => {
        const deleteAoeRelation = await prisma.aOE.delete({
            where: {
                id: id
            }
        });
        if (deleteAoeRelation)
            return redirect("/menubar/aoe?page=relations&groupId=" + groupId);
        else
            return redirect("/menubar/aoe?error=fail?page=relations&groupId=" + groupId);
    }
    //查找aoe关系
    static get = async (userId: string, groupId: string) => {
        return await prisma.aOE.findMany({
            where: {
                userId: userId,
                groupId: groupId,
            }
        });
    }
}