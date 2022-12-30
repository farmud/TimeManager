// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useState} from "react";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/utils/auth.server";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import type {ItemProps} from "~/components/planlist/item";
import {PlayList} from "~/components/planlist/play-list";
import {getPlans, searchPlans} from "~/utils/plan.server";
import {FormField} from "~/components/form/form-field";

export const loader: LoaderFunction = async ({request}) => {
    const plans = await getPlans(await requireUserId(request));
    const planList: ItemProps[] = plans.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed,
        };
    });
    return json({plans: planList}, {status: 200});
};

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    let name = form.get("name");
    const startTime_f = form.get("startTime");
    const endTime_f = form.get("endTime");

    name = name as string;
    const startTime = startTime_f ? new Date(startTime_f as string) : undefined;
    const endTime = endTime_f ? new Date(endTime_f as string) : undefined;

    const plans = await searchPlans({
        userId: await requireUserId(request), name, startTime, endTime
    });

    const planList: ItemProps[] = plans.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed,
        };
    });
    return json({plans: planList, name: name, startTime: startTime_f, endTime: endTime_f}, {status: 200});
}

export default function Index() {
    const planList_l = useLoaderData();
    const planList_a = useActionData();

    let plans: ItemProps[];
    if (planList_a) {
        plans = planList_a.plans;
    } else {
        plans = planList_l.plans;
    }

    const [searchParams, setSearchParams] = useState({
        name: planList_a ? planList_a.name : undefined,
        startTime: planList_a ? planList_a.startTime : undefined,
        endTime: planList_a ? planList_a.endTime : undefined,
    });

    const handleSearch = (event: React.ChangeEvent<HTMLFormElement>) => {
        setSearchParams(searchParams => ({...searchParams, [event.target.name]: event.target.value}));
    }

    return (
        <>
            <div className="w-full h-20 grid grid-cols-8 bg-[#ffedd5] items-center">
                <label className="text-2xl font-bold text-center">任务列表</label>
                <Form method="post" className="col-span-7 grid grid-cols-4">
                    <FormField
                        className="input input-bordered col-span-2 text-xs"
                        htmlFor="name"
                        label="任务名称"
                        value={searchParams.name}
                        onChange={handleSearch}
                        hasError={false}
                        horizontal={false}
                    />
                    <FormField
                        className="input input-bordered col-span-2 text-xs"
                        htmlFor="startTime"
                        label="开始时间"
                        type="datetime-local"
                        value={searchParams.startTime}
                        onChange={handleSearch}
                        hasError={false}
                        horizontal={false}
                    />
                    <FormField
                        className="input input-bordered col-span-2 text-xs"
                        htmlFor="endTime"
                        label="结束时间"
                        type="datetime-local"
                        value={searchParams.endTime}
                        onChange={handleSearch}
                        hasError={false}
                        horizontal={false}
                    />
                    <div className="w-full grid justify-around items-center">
                        <div className="btn-group">
                            <button className="btn btn-sm btn-primary border-r-black">查询</button>
                            <button
                                className="btn btn-sm btn-success border-l-black"
                                onClick={() => setSearchParams({
                                    name: undefined,
                                    startTime: undefined,
                                    endTime: undefined
                                })}
                            >重置
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
            <div className="w-full h-[87%] overflow-y-auto">
                <PlayList items={plans}/>
            </div>
        </>
    );
};
