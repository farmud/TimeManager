import React from "react";

export interface AoeRelationItemProps {
    num: number,        //关系数量
    id: string,         //关系id
    parentId?: string,  //父节点id
    parent?: string,    //父节点信息
    childId?: string,   //子节点id
    child?: string,     //子节点信息
    day: number,        //天数
    hour: number,       //小时
    content: string     //备注
    groupId: string,    //组id
}

export function AoeRelationItem({
                                    num,
                                    id,
                                    parent,
                                    child,
                                    day,
                                    hour,
                                    content,
                                    groupId,
                                }: AoeRelationItemProps) {
    return (
        <>
            <tr className="items-center hover">
                <th className="text-center">{num}</th>
                <td className="text-center">{parent}</td>
                <td className="text-center">{child}</td>
                <td className="text-center"> {day} 天 {hour} 时 </td>
                <td className="text-center">{content}</td>
                <td className="text-center">
                    <form action="aoe/relationDao" method="post">
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <input name="id" defaultValue={id} className="hidden"/>
                        <button type="submit" name="_action" value="delete" className="btn btn-sm btn-error w-24">删除</button>
                    </form>
                </td>
            </tr>
        </>
    );
}