import type {AoeGroupItemProps} from "~/components/aoe/aoe-group-item";
import {AoeGroupItem} from "~/components/aoe/aoe-group-item";
import {FormField} from "~/components/form/form-field";
import React, {useEffect, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface AoeGroupListProps {
    aoeItems: AoeGroupItemProps[];
    onChange?: (...args: any[]) => any;
    value?: string;
}

export function AoeGroupList({
                                 aoeItems, onChange = () => {
    }, value = ""
                             }: AoeGroupListProps) {
    const list = aoeItems.map((aoeItem: AoeGroupItemProps) =>
        <AoeGroupItem
            key={aoeItem.id}
            num={aoeItem.num}
            name={aoeItem.name}
            number={aoeItem.number}
            content={aoeItem.content}
            id={aoeItem.id}
            onChange={onChange}
            disabled={value === aoeItem.id}
        />);

    const [submit, setSubmit] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        content: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    useEffect(() => {
        if (!submit && formData.name.length > 0 && formData.content.length > 0)
            setSubmit(true);
        else if (submit && (formData.name.length === 0 || formData.content.length === 0))
            setSubmit(false);
    }, [formData, submit])

    return (
        <>
            <table className="table table-compact w-full">
                <thead>
                <tr>
                    <th className="text-center">序号</th>
                    <th className="text-center">任务组名称</th>
                    <th className="text-center">任务数量</th>
                    <th className="text-center">任务组描述</th>
                    <th className="text-center">
                        <label htmlFor="my-modal-1" className="btn btn-sm btn-primary w-24">新增</label>
                    </th>
                </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </table>

            <input type="checkbox" id="my-modal-1" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box max-w-4xl">
                    <h3 className="font-bold text-lg">新增任务组</h3>
                    <form action="aoe/groupDao" method="post" className="w-full">
                        <table className="table w-full">
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="name"
                                        label="任务组名称"
                                        value={formData.name}
                                        onChange={(event) => handleChange(event)}
                                        horizontal={false}
                                    />
                                </td>
                                <td>
                                    <FormField
                                        htmlFor="content"
                                        label="任务内容"
                                        className="textarea h-56 input-bordered col-span-2"
                                        value={formData.content}
                                        onChange={(event) => handleChange(event)}
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