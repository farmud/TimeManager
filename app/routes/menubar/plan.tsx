import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, Link, useActionData, useLoaderData} from "@remix-run/react";
import React, {useEffect, useRef, useState} from "react";
import {FormField} from "~/components/form/form-field";
import {SelectField} from "~/components/form/select-field";
import {PlayListSm} from "~/components/planlist/plan-list-sm";
import {searchPlans, updatePlan} from "~/utils/plan.server";
import {requireUserId} from "~/utils/auth.server";
import type {ItemProps} from "~/components/planlist/item";

export const loader: LoaderFunction = async ({request}) => {
    const id = new URL(request.url).searchParams.get("id") as string;
    const type = new URL(request.url).searchParams.get("type") as string;
    let plans = await searchPlans({
        userId: await requireUserId(request), id
    });
    const plan = plans[0]
    if (type === "edit") plans = await searchPlans({
        userId: await requireUserId(request), id, children: false
    });
    else plans = await searchPlans({
        userId: await requireUserId(request), id, parent: true
    });
    const planList: ItemProps[] = plans.map((plan, index) => {
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
    return json({plan, planList, type}, {status: 200});
}

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();

    const id = new URL(request.url).searchParams.get("id") as string;
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

    return await updatePlan({id, userId, name, content, startTime, endTime, status, parentId});
}

export default function Plan() {
    const firstLoad = useRef(true);
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const ref = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState(() => {
        if (actionData?.plan) {
            return {
                name: actionData.plan.name,
                startTime: new Date(actionData.plan.startTime).toISOString().slice(0, 16),
                endTime: new Date(actionData.plan.endTime).toISOString().slice(0, 16),
                content: actionData.plan.content,
                parentId: actionData.plan.parentId,
                status: actionData.plan.status,
            }
        } else if (loaderData.plan) {
            return {
                name: loaderData.plan.name,
                startTime: new Date(loaderData.plan.startTime).toISOString().slice(0, 16),
                endTime: new Date(loaderData.plan.endTime).toISOString().slice(0, 16),
                content: loaderData.plan.content,
                parentId: loaderData.plan.parentId,
                status: loaderData.plan.status,
            }
        } else {
            return {
                name: undefined,
                startTime: undefined,
                endTime: undefined,
                content: undefined,
                parentId: undefined,
                type: undefined,
                status: undefined,
            }
        }
    });
    const [error] = useState(actionData?.error);

    useEffect(() => {
        firstLoad.current = false;
    }, []);

    useEffect(() => {
        if (actionData?.error && !firstLoad.current) {
            const count = function (t: number) {
                let timer: string | number | NodeJS.Timeout | undefined;
                let i = 0;

                function change(tar: number) {
                    if (ref.current) {
                        const num = 1 - i / tar;
                        ref.current.style.opacity = num.toString();
                        if (i === tar) {
                            clearInterval(timer);
                            return false;
                        }
                        timer = setTimeout(function () {
                            change(tar);
                        }, i === 0 ? 1000 : 50);
                        i++;
                    }
                    return change;
                }

                change(t);
            };
            count(5);
        }
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value});
        console.log(event.target.value);
    }

    return (
        <>
            <div className="grid justify-around overflow-y-auto w-full h-full bg-[#CCE8CF] gap-4">
                {error !== undefined &&
                    <>
                        <div ref={ref} className="toast toast-top toast-center w-32">
                            <div className="alert alert-error grid justify-around">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
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
                                    readonly={loaderData.type !== "edit"}
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
                                    readonly={loaderData.type !== "edit"}
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
                                    readonly={loaderData.type !== "edit"}
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
                                    readonly={loaderData.type !== "edit"}
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
                                    readonly={loaderData.type !== "edit"}
                                />
                            </td>
                        </tr>
                        {loaderData.planList.length > 0 &&
                            <tr>
                                <td colSpan={2}>
                                    <div className="grid grid-cols-6">
                                        <label htmlFor="parentId" className="label">
                                            <span className="w-full label-text text-right">
                                                {loaderData.type === "edit" ? "请选择父任务" : "所有父任务"}
                                            </span>
                                        </label>
                                        <div className="overflow-y-auto h-[26rem] col-span-5">
                                            <PlayListSm
                                                name="parentId"
                                                value={formData.parentId}
                                                onChange={handleChange}
                                                items={loaderData.planList}
                                                readonly={loaderData.type !== "edit"}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        }
                        <tr>
                            <td colSpan={2}>
                                <div className="flex justify-end gap-5">
                                    <Link to="/menubar">
                                        <button type="button" className="btn btn-primary w-24">返回</button>
                                    </Link>
                                    {loaderData.type === "edit" &&
                                        <button type="submit" className="btn btn-primary w-24">提交</button>}
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
        </>
    )
}