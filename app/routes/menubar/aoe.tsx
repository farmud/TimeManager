import {Form, useActionData, useLoaderData} from "@remix-run/react";
import React, {useState} from "react";
import Group from "~/routes/menubar/aoe/group";
import {json} from "@remix-run/node";
import {requireUserId} from "~/utils/auth.server";
import Chart from "~/routes/menubar/aoe/chart";
import Plans from "./aoe/plans";
import Relations from "~/routes/menubar/aoe/relations";
import {AoeGroup, AoePlan, AoeRelation} from "~/utils/aoe.server";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import type {AoeGroupItemProps} from "~/components/aoe/aoe-group-item";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import type {AoeRelationItemProps} from "~/components/aoe/aoe-relation-item";

export const loader: LoaderFunction = async ({request}) => {
    const error = new URL(request.url).searchParams.get("error");
    const page = new URL(request.url).searchParams.get("page");
    const groupId = new URL(request.url).searchParams.get("groupId") as string;
    const aoeGroups = await AoeGroup.get(await requireUserId(request));
    const aoeGroupList: AoeGroupItemProps[] = aoeGroups.map((group, index) => {
        return {
            num: index + 1,
            name: group.name,
            number: group.AOEPlan.length,
            content: group.content,
            id: group.id,
        };
    });
    let aoePlanList: AoePlanItemProps[] = [];
    let aoeRelationList: AoeRelationItemProps[] = [];

    if (groupId) {
        const aoePlans = await AoePlan.search({userId: await requireUserId(request), groupId});
        aoePlanList = aoePlans.map((plan, index) => {
            return {
                num: index + 1,
                name: plan.name,
                content: plan.content,
                id: plan.id,
                groupId: groupId,
            };
        });
        const aoeRelations = await AoeRelation.get(await requireUserId(request), groupId);
        aoeRelationList = aoeRelations.map((relation, index) => {
            return {
                num: index + 1,
                id: relation.id,
                parentId: relation.parentId,
                childId: relation.childId,
                day: relation.day,
                hour: relation.hour,
                content: relation.content,
                groupId: groupId,
            };
        });
    }

    if (error) return json({
        aoeGroupList,
        page,
        groupId,
        aoePlanList,
        aoeRelationList,
        error: "提交失败"
    }, {status: 200});
    else return json({aoeGroupList, page, groupId, aoePlanList, aoeRelationList}, {status: 200});
};

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const action = form.get("_action");
    let aoePlanList: AoePlanItemProps[] = [];
    let aoeRelationList: AoeRelationItemProps[] = [];

    switch (action) {
        case "searchGroups": {
            let name = form.get("name") as string;

            const aoeGroups = await AoeGroup.search({
                userId: await requireUserId(request), name
            });
            const aoeGroupList: AoeGroupItemProps[] = aoeGroups.map((group, index) => {
                return {
                    num: index + 1,
                    name: group.name,
                    number: group.AOEPlan.length,
                    content: group.content,
                    id: group.id,
                };
            });

            return json({aoeGroupList}, {status: 200});
        }
        case "searchPlans": {
            const groupId = form.get("groupId") as string;
            const name = form.get("name") as string;
            if (groupId !== "") {
                const aoePlans = await AoePlan.search({userId: await requireUserId(request), groupId, name});
                aoePlanList = aoePlans.map((plan, index) => {
                    return {
                        num: index + 1,
                        name: plan.name,
                        content: plan.content,
                        id: plan.id,
                        groupId: groupId,
                    };
                });
            }
            return json({aoePlanList, groupId}, {status: 200});
        }
        case "searchRelations": {
            const groupId = form.get("groupId") as string;
            if (groupId !== "") {
                const aoePlans = await AoePlan.search({userId: await requireUserId(request), groupId});
                aoePlanList = aoePlans.map((plan, index) => {
                    return {
                        num: index + 1,
                        name: plan.name,
                        content: plan.content,
                        id: plan.id,
                        groupId: groupId,
                    };
                });
                const aoeRelations = await AoeRelation.get(await requireUserId(request), groupId);
                aoeRelationList = aoeRelations.map((relation, index) => {
                    return {
                        num: index + 1,
                        id: relation.id,
                        parentId: relation.parentId,
                        childId: relation.childId,
                        day: relation.day,
                        hour: relation.hour,
                        content: relation.content,
                        groupId: groupId,
                    };
                });
            }
            return json({aoePlanList, aoeRelationList, groupId}, {status: 200});
        }
        default:
            return json({}, {status: 200});
    }
}

export default function Aoe() {
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const [page, setPage] = useState(loaderData.page ? loaderData.page : "");
    const [selected, setSelected] = useState(loaderData.groupId ? loaderData.groupId : "");

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (event.target instanceof HTMLButtonElement) {
            setSelected(event.target.value);
        }
    }
    return (
        <>
            <Form method="post">
                <div className="tabs w-full">
                    <input name="groupId" value={selected} className="hidden" onChange={_=>_}/>
                    <input name="name" defaultValue="" className="hidden"/>
                    <label className={page === "" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
                           onClick={_ => setPage("")}>
                        <button name="_action" value="searchGroups">任务组</button>
                    </label>
                    <label className={page === "plans" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
                           onClick={_ => setPage("plans")}>
                        <button name="_action" value="searchPlans">节点</button>
                    </label>
                    <label className={page === "relations" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
                           onClick={_ => setPage("relations")}>
                        <button name="_action" value="searchRelations">关系</button>
                    </label>
                    <label className={page === "chart" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
                           onClick={_ => setPage("chart")}>
                        <button name="_action" value="searchRelations">AOE图</button>
                    </label>
                </div>
            </Form>
            {page === "" &&
                <Group loaderData={loaderData} actionData={actionData} onSelected={handleSelect} value={selected}/>}
            {page === "plans" && <Plans loaderData={loaderData} actionData={actionData} groupId={selected}/>}
            {page === "relations" && <Relations loaderData={loaderData} actionData={actionData} groupId={selected}/>}
            {page === "chart" && <Chart loaderData={loaderData} actionData={actionData}/>}
        </>
    )
}
