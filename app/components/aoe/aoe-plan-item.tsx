import React, {useEffect, useState} from "react";
import {FormField} from "~/components/form/form-field";

export interface AoePlanItemProps {
    num: number,
    name: string,
    content: string,
    id: string,
    groupId: string,
}

export function AoePlanItem({
                                num,
                                name,
                                content,
                                id,
                                groupId,
                            }: AoePlanItemProps) {
    const [formData, setFormData] = useState({
        name: name,
        content: content
    });
    const [submit, setSubmit] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if (event.target.name === "day") {
        //     let value = parseInt(event.target.value);
        //     if (value < 0) value = 0;
        //     setFormData({...formData, [event.target.name]: value,});
        // } else if (event.target.name === "hour") {
        //     let value = parseInt(event.target.value);
        //     if (value < 0) value = 0;
        //     if (value > 23) value = 23;
        //     setFormData({...formData, [event.target.name]: value,});
        // } else
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
            <tr className="items-center hover">
                <th className="text-center">{num}</th>
                <td className="text-center">{name}</td>
                <td className="text-center">{content}</td>
                <td className="text-center">
                    <label htmlFor={"aoePlan-update" + id} className="btn btn-sm btn-primary w-24">编辑</label>
                </td>
            </tr>

            <input type="checkbox" id={"aoePlan-update" + id} className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box max-w-4xl">
                    <h3 className="font-bold text-lg">编辑任务</h3>
                    <form action="aoe/planDao" method="post" className="w-full">
                        <input name="id" defaultValue={id} className="hidden"/>
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <table className="table w-full">
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
                                <td>
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
                                <td colSpan={2}>
                                    <div className="flex justify-end gap-5">
                                        <div className="btn-group">
                                            <label htmlFor={"aoePlan-update" + id}
                                                   className="btn btn-primary w-24">返回</label>
                                            <button name="_action" value="delete" type="submit"
                                                    className="btn btn-error w-24" disabled={!submit}>删除
                                            </button>
                                            <button name="_action" value="update" type="submit"
                                                    className="btn btn-primary w-24" disabled={!submit}>提交
                                            </button>
                                        </div>
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