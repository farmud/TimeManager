import React from "react";
import {AoeRelationList} from "~/components/aoe/aoe-relation-list";

interface RelationsProps {
    loaderData: any;
    actionData: any;
    groupId: string;
}

export default function Relations({loaderData, actionData, groupId}: RelationsProps) {
    const aoePlanList = actionData?.aoePlanList ? actionData.aoePlanList : loaderData.aoePlanList;
    const aoeRelationList = actionData?.aoeRelationList ? actionData.aoeRelationList : loaderData.aoeRelationList;

    return (
        <>
            <div className="w-full h-20 bg-[#ffedd5] flex justify-around"
                 style={{display: "flex", alignItems: "center"}}>
                <label className="text-2xl font-bold text-center">任务关系</label>
            </div>
            <div className="w-full h-[81%] overflow-y-auto">
                <AoeRelationList aoeRelationItems={aoeRelationList} aoePlanItems={aoePlanList} groupId={groupId}/>
            </div>
        </>
    );
};