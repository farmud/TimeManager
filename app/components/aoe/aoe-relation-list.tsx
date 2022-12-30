import React, {useEffect, useState} from "react";
import {AoeRelationItem} from "~/components/aoe/aoe-relation-item";
import {SelectField} from "~/components/form/select-field";
import type {AoeRelationItemProps} from "~/components/aoe/aoe-relation-item";
import type {OptionFieldProps} from "~/components/form/select-field";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import {FormField} from "~/components/form/form-field";

interface AoeRelationListProps {
    aoeRelationItems: AoeRelationItemProps[];
    aoePlanItems: AoePlanItemProps[];
    groupId?: string;
}

export function AoeRelationList({aoeRelationItems, aoePlanItems, groupId = ""}: AoeRelationListProps) {
    const list = aoeRelationItems.map((aoeItem: AoeRelationItemProps) => {
        const parentName = aoePlanItems.find((plan) => plan.id === aoeItem.parentId)?.name;
        const childName = aoePlanItems.find((plan) => plan.id === aoeItem.childId)?.name;
        return (
            <AoeRelationItem
                key={aoeItem.id}
                num={aoeItem.num}
                id={aoeItem.id}
                parent={parentName}
                child={childName}
                day={aoeItem.day}
                hour={aoeItem.hour}
                content={aoeItem.content}
                groupId={aoeItem.groupId}
            />
        );
    });

    const [submit, setSubmit] = useState(false);

    const [parent, setParent] = useState<OptionFieldProps[]>([]);

    const [child, setChild] = useState<OptionFieldProps[]>([]);

    const [formData, setFormData] = useState({
        parentId: "",
        childId: "",
        day: 0,
        hour: 0,
        content: ""
    });

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if(event.target.name === "parentId") {
            const parents = getParents(aoePlanItems, event.target.value);
            const child_ = getChild(aoePlanItems, event.target.value);
            setChild(aoePlanItems.filter(
                (plan) => !parents.includes(plan) && !child_.includes(plan)
            ).map((plan) => {
                return {
                    value: plan.id,
                    label: plan.name,
                };
            }));
            if(child.filter((item)=> item.value === formData.childId).length === 0)
                setFormData({...formData, [event.target.name]: event.target.value, childId: ""});
            else
                setFormData({...formData, [event.target.name]: event.target.value});
        }
        else if(event.target.name === "childId") {
            const children = getChildren(aoePlanItems, event.target.value);
            const parent_ = getParent(aoePlanItems, event.target.value);
            setParent(aoePlanItems.filter(
                (plan) => !children.includes(plan) && !parent_.includes(plan)
            ).map((plan) => {
                return {
                    value: plan.id,
                    label: plan.name,
                };
            }));
            if(parent.filter((item)=> item.value === formData.parentId).length === 0)
                setFormData({...formData, [event.target.name]: event.target.value, parentId: ""});
            else
                setFormData({...formData, [event.target.name]: event.target.value});
        }
        else if (event.target.name === "day") {
            let value = parseInt(event.target.value);
            if (value < 0) value = 0;
            setFormData({...formData, [event.target.name]: value});
        }
        else if (event.target.name === "hour") {
            let value = parseInt(event.target.value);
            if (value < 0) value = 0;
            if (value > 23) value = 23;
            setFormData({...formData, [event.target.name]: value});
        }
        else {
            setFormData({...formData, [event.target.name]: event.target.value});
        }
    }

    //所有子节点
    function getChildren<T>(plans: T[], parentId: string) : T[] {
        let result: T[] = [];
        result.push(plans.find((plan: any) => plan.id === parentId)!!);
        const relationList = aoeRelationItems.filter((relation) => relation.parentId === parentId);
        relationList.forEach((relation) => {
            const child: any = plans.find((plan: any) => plan.id === relation.childId)!!;
            getChildren(plans, child.id).forEach((item) => {
                result.push(item);
            });
        });
        return result;
    }

    //所有父节点
    function getParents<T>(plans: T[], childId: string) : T[] {
        let result: T[] = [];
        result.push(plans.find((plan: any) => plan.id === childId)!!);
        const relationList = aoeRelationItems.filter((relation) => relation.childId === childId);
        relationList.forEach((relation) => {
            const parent: any = plans.find((plan: any) => plan.id === relation.parentId)!!;
            getParents(plans, parent.id).forEach((item) => {
                result.push(item);
            });
        });
        return result;
    }

    //直接子节点
    function getChild<T>(plans: T[], parentId: string) : T[] {
        let result: T[] = [];
        const relationList = aoeRelationItems.filter((relation) => relation.parentId === parentId);
        relationList.forEach((relation) => {
            const child: any = plans.find((plan: any) => plan.id === relation.childId)!!;
            result.push(child);
        });
        return result;
    }

    //直接父节点
    function getParent<T>(plans: T[], childId: string) : T[] {
        let result: T[] = [];
        const relationList = aoeRelationItems.filter((relation) => relation.childId === childId);
        relationList.forEach((relation) => {
            const parent: any = plans.find((plan: any) => plan.id === relation.parentId)!!;
            result.push(parent);
        });
        return result;
    }

    useEffect(() => {
        if (!submit && formData.parentId.length > 0 && formData.childId.length > 0 && formData.content.length > 0)
            setSubmit(true);
        else if (submit && (formData.parentId.length === 0 || formData.childId.length === 0 || formData.content.length === 0))
            setSubmit(false);
    }, [formData, submit])

    useEffect(() => {
        initialSelect();
    }, [aoePlanItems])

    function initialSelect(){
        setParent(aoePlanItems.map((aoeItem) => {
            return {
                value: aoeItem.id,
                label: aoeItem.name,
            }
        }))
        setChild(aoePlanItems.map((aoeItem) => {
            return {
                value: aoeItem.id,
                label: aoeItem.name,
            }
        }))
    }

    return (
        <>
            {groupId !== "" &&
                <table className="table table-compact w-full">
                    <thead>
                    <tr>
                        <th className="text-center">序号</th>
                        <th className="text-center">前置节点</th>
                        <th className="text-center">后置节点</th>
                        <th className="text-center">任务周期</th>
                        <th className="text-center">任务描述</th>
                        <th className="text-center">
                            <label htmlFor="my-modal-1" className="btn btn-sm btn-primary w-24">新增</label>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list}
                    </tbody>
                </table>
            }
            {groupId === "" &&
                <div className="h-full text-center grid justify-around" style={{display: "flex", alignItems: "center"}}>
                    <h1 className="text-4xl font-bold">
                        <span>请选择任务组</span>
                    </h1>
                </div>
            }
            <input type="checkbox" id="my-modal-1" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box max-w-4xl">
                    <h3 className="font-bold text-lg">新增关系</h3>
                    <form action="aoe/relationDao" method="post" className="w-full">
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <table className="table w-full">
                            <tr>
                                <td>
                                    <SelectField
                                        htmlFor="parentId"
                                        label="前置节点"
                                        value={formData.parentId}
                                        args={parent}
                                        onChange={handleChange}
                                        tips="请选择前置任务"
                                        horizontal={false}
                                    />
                                </td>
                                <td rowSpan={4}>
                                    <FormField
                                        htmlFor="content"
                                        label="任务描述"
                                        className="textarea h-56 input-bordered col-span-2"
                                        value={formData.content}
                                        onChange={handleChange}
                                        textarea={true}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <SelectField
                                        htmlFor="childId"
                                        label="后置节点"
                                        value={formData.childId}
                                        args={child}
                                        onChange={handleChange}
                                        tips="请选择后置任务"
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="day"
                                        label="天数"
                                        type="number"
                                        value={formData.day}
                                        onChange={handleChange}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="hour"
                                        label="小时"
                                        type="number"
                                        value={formData.hour}
                                        onChange={handleChange}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="flex justify-end gap-5">
                                        <label htmlFor="my-modal-1" className="btn btn-primary w-24" onClick={
                                            () => {
                                                setFormData({
                                                    parentId: "",
                                                    childId: "",
                                                    day: 0,
                                                    hour: 0,
                                                    content: ""
                                                })
                                                initialSelect();
                                            }
                                        }>返回</label>
                                        <button name="_action" value="create" type="submit"
                                                className="btn btn-primary w-24" disabled={!submit}>提交
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </>
    );
}