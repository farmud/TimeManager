import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {FormField} from "~/components/form/form-field";
import React, {useState} from "react";
import {SelectField} from "~/components/form/select-field";
import {createPlan, getPlans} from "~/utils/plan.server";
import {requireUserId} from "~/utils/auth.server";
import {PlayListSm} from "~/components/planlist/plan-list-sm";
import type {ItemProps} from "~/components/planlist/item";

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
    return json({planList}, {status: 200});
};

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();

    const userId = await requireUserId(request);
    const name = form.get("name") as string;
    const content = form.get("content") as string;
    const startTime_f = form.get("startTime") as string;
    const endTime_f = form.get("endTime") as string;
    const status_f = form.get("status") as string;
    const parentId = form.get("parentId") as string;

    if (!name || !content || !startTime_f || !endTime_f || !status_f) {
        return json({
            error: "数据填写不完整", plan: {
                name,
                startTime: startTime_f ? new Date(startTime_f) : undefined,
                endTime: endTime_f ? new Date(endTime_f) : undefined,
                content,
                parentId,
                status: status_f
            }
        }, {status: 400});
    }
    const startTime = new Date(startTime_f);
    const endTime = new Date(endTime_f);
    const status = parseInt(status_f);
    return await createPlan({userId, name, startTime, endTime, status, content, parentId});
}

export default function Add() {
    const loaderData = useLoaderData();

    const [formData, setFormData] = useState({
        name: undefined,
        content: undefined,
        startTime: undefined,
        endTime: undefined,
        status: 0,
        parentId: undefined
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    return (
        <>
            <div className="grid justify-around overflow-y-auto w-full h-full bg-[#CCE8CF]">
                <Form method="post" className="w-full">
                    <table className="table">
                        <tr>
                            <td>
                                <FormField
                                    htmlFor="name"
                                    label="任务名称"
                                    value={formData.name}
                                    onChange={handleChange}
                                    horizontal={false}
                                />
                            </td>
                            <td rowSpan={4}>
                                <FormField
                                    htmlFor="content"
                                    label="任务内容"
                                    className="textarea h-56 input-bordered col-span-2"
                                    value={formData.content}
                                    onChange={handleChange}
                                    horizontal={false}
                                    textarea={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FormField
                                    htmlFor="startTime"
                                    label="开始时间"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    horizontal={false}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FormField
                                    htmlFor="endTime"
                                    label="结束时间"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    horizontal={false}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <SelectField
                                    htmlFor="status"
                                    label="任务优先级"
                                    value={formData.status}
                                    args={[{value: 0, label: "无"},
                                        {value: 1, label: "低"},
                                        {value: 2, label: "中"},
                                        {value: 3, label: "高"}]}
                                    onChange={handleChange}
                                    horizontal={false}
                                />
                            </td>
                        </tr>
                        {loaderData.planList.length > 0 &&
                            <tr>
                                <td colSpan={2}>
                                    <div className="grid grid-cols-6">
                                        <label htmlFor="parentId" className="label">
                                            <span className="w-full label-text text-right">请选择父任务</span>
                                        </label>
                                        <div className="overflow-y-auto h-[26rem] col-span-5">
                                            <PlayListSm
                                                name="parentId"
                                                value={formData.parentId}
                                                onChange={handleChange}
                                                items={loaderData.planList}
                                                readonly={false}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        }
                        <tr>
                            <td colSpan={2}>
                                <div className="grid justify-items-stretch">
                                    <button
                                        type="submit" className="btn btn-primary w-24 justify-self-end">提交
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
        </>
    )
}