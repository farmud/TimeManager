import type {ItemProps} from "~/components/planlist/item";
import {Item} from "~/components/planlist/item";
import {Link} from "@remix-run/react";

interface PlayListProps {
    items: ItemProps[];
}

export function PlayList({items}: PlayListProps) {
    // eslint-disable-next-line react/jsx-key
    const list = items.map((item: ItemProps) => <Item {...item}/>);
    return (
        <>
            <table className="table table-compact w-full">
                <thead>
                <tr>
                    <th className="text-center">序号</th>
                    <th className="text-center">任务名称</th>
                    <th className="text-center">任务时间</th>
                    <th className="text-center">任务优先级</th>
                    <th className="text-center">
                        <Link to="/menubar/add">
                            <button className="btn btn-sm btn-primary w-24">新增</button>
                        </Link>
                    </th>
                </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </table>
        </>
    );
}
