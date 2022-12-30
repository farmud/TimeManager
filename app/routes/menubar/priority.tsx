import {PlayListSm} from "~/components/planlist/plan-list-sm";
import React from "react";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {getPlansByType} from "~/utils/plan.server";
import {requireUserId} from "~/utils/auth.server";
import type {ItemProps} from "~/components/planlist/item";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const plans1 = await getPlansByType(await requireUserId(request), 2);
    const planList1: ItemProps[] = plans1.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });

    const plans2 = await getPlansByType(await requireUserId(request), 1);
    const planList2: ItemProps[] = plans2.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });
    const plans3 = await getPlansByType(await requireUserId(request), 3);
    const planList3: ItemProps[] = plans3.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });

    const plans4 = await getPlansByType(await requireUserId(request), 4);
    const planList4: ItemProps[] = plans4.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });
    return json({plans1: planList1, plans2: planList2, plans3: planList3, plans4: planList4}, {status: 200});
};

export default function PriorityList() {
    const data = useLoaderData();
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-2 h-full bg-[#CCE8CF]">
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-error btn-sm">重要且紧急</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">重要且紧急的任务，需要立即处理，否则会有很大的损失。</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans1}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-warning btn-sm">重要不紧急</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">重要不紧急的任务，需要在合适的时间处理，否则会有一定的损失。</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans2}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-info btn-sm">紧急但不重要</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">紧急但不重要的任务，需要立即处理，但是不会有很大的损失。</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans3}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-success btn-sm">不重要不紧急</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">不重要不紧急的任务，可以不处理，也不会有损失。</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans4}
                        value={undefined}
                    />
                </div>
            </div>
        </div>
    )
}