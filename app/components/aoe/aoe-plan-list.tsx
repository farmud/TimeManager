import {FormField} from "~/components/form/form-field";
import React, {useEffect, useState} from "react";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import {AoePlanItem} from "~/components/aoe/aoe-plan-item";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface AoePlanListProps {
    aoeItems: AoePlanItemProps[];
    groupId?: string;
}

export function AoePlanList({aoeItems, groupId = ""}: AoePlanListProps) {
    const list = aoeItems.map((aoeItem: AoePlanItemProps) =>
        <AoePlanItem
            key={aoeItem.id}
            num={aoeItem.num}
            name={aoeItem.name}
            content={aoeItem.content}
            id={aoeItem.id}
            groupId={aoeItem.groupId}
        />);

    const [submit, setSubmit] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        content: "",
        day: 0,
        hour: 0,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value,});
    }

    useEffect(() => {
        if (!submit && formData.name.length > 0 && formData.content.length > 0)
            setSubmit(true);
        else if (submit && (formData.name.length === 0 || formData.content.length === 0))
            setSubmit(false);
    }, [formData, submit])

    return (
        <>
            {groupId !== "" &&
                <table className="table table-compact w-full">
                    <thead>
                    <tr>
                        <th className="text-center">序号</th>
                        <th className="text-center">节点名称</th>
                        <th className="text-center">节点描述</th>
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
                    <h3 className="font-bold text-lg">新增节点</h3>
                    <form action="aoe/planDao" method="post" className="w-full">
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <table className="table w-full">
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="name"
                                        label="节点名称"
                                        value={formData.name}
                                        onChange={handleChange}
                                        horizontal={false}
                                    />
                                </td>
                                <td>
                                    <FormField
                                        htmlFor="content"
                                        label="节点内容"
                                        className="textarea h-56 input-bordered col-span-2"
                                        value={formData.content}
                                        onChange={handleChange}
                                        horizontal={false}
                                        textarea={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="flex justify-end gap-5">
                                        <label htmlFor="my-modal-1" className="btn btn-primary w-24">返回</label>
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