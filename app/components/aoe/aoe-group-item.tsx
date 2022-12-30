import React, {useEffect, useState} from "react";
import {FormField} from "~/components/form/form-field";

export interface AoeGroupItemProps {
    num: number,
    name: string,
    number: number,
    content: string,
    id: string,
    onChange?: (...args: any) => any;
    disabled?: boolean;
}

export function AoeGroupItem({
                                 num,
                                 name,
                                 number,
                                 content,
                                 id,
                                 onChange = () => {
                                 },
                                 disabled = false
                             }: AoeGroupItemProps) {
    const [formData, setFormData] = useState({
        id: id,
        name: name,
        content: content
    });
    const [submit, setSubmit] = useState(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
            <tr className="items-center hover">
                <th className="text-center">{num}</th>
                <td className="text-center">{name}</td>
                <td className="text-center">{number}</td>
                <td className="text-center">{content}</td>
                <td className="text-center">
                    <div className="btn-group">
                        <label htmlFor={"aoeGroup-" + id}
                               className="btn btn-sm btn-primary w-12 border-r-black">编辑</label>
                        <button className="btn btn-sm btn-info w-12 border-l-black" value={id} onClick={onChange}
                                disabled={disabled}>选择
                        </button>
                    </div>
                </td>
            </tr>
            <input type="checkbox" id={"aoeGroup-" + id} className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box max-w-4xl">
                    <h3 className="font-bold text-lg">编辑任务组</h3>
                    <form action="aoe/groupDao" method="post" className="w-full">
                        <input id="id" name="id" defaultValue={formData.id} className="hidden"></input>
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
                                        <div className="btn-group">
                                            <label htmlFor={"aoeGroup-" + id}
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