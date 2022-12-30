import {Link} from "@remix-run/react";

export interface ItemProps {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    status: number;
    num: number;
    completed: boolean;
}

export function Item({
                         id,
                         name,
                         startTime,
                         endTime,
                         status,
                         num,
                         completed,
                     }: ItemProps) {
    const importance = () => {
        switch (status) {
            case 0:
                return <div className="badge bg-gray-300 text-black border-0">无</div>
            case 1:
                return <div className="badge badge-primary">低</div>
            case 2:
                return <div className="badge badge-accent">中</div>
            case 3:
                return <div className="badge badge-secondary">高</div>
            default:
                return "bg-gray-500";
        }
    }
    startTime = new Date(startTime);
    endTime = new Date(endTime);
    return (
        <tr className="items-center hover">
            <th className="text-center">{num}</th>
            <td className="text-center">{name}</td>
            <td className="text-center">
                <div className="flex">
                    <div className="grid h-20 flex-grow rounded-box place-items-center">
                        {startTime.toLocaleDateString()}<br/>{startTime.toLocaleTimeString()}
                    </div>
                    <pre className="self-center">   -   </pre>
                    <div className="grid h-20 flex-grow rounded-box place-items-center">
                        {endTime.toLocaleDateString()}<br/>{endTime.toLocaleTimeString()}
                    </div>
                </div>
            </td>
            <td className="text-center">{importance()}</td>
            <td className="text-center">
                <div className="btn-group w-24">
                    <button className="btn btn-success border-r-black btn-sm">
                        <Link to={`/menubar/plan?id=${id}&type=view`}>详情</Link>
                    </button>
                    <button
                        className="btn btn-success border-l-black lowercase dropdown dropdown-left no-animation btn-sm">
                        <label tabIndex={0}>v</label>
                        <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-box w-18 mt-2">
                            <li key={1}>
                                <form action="/menubar/update" method="post">
                                    <input className="hidden" name="id" defaultValue={id}/>
                                    <button type="submit" name="_action"
                                            value="complete">{completed ? "取消完成" : "完成"}</button>
                                </form>
                            </li>
                            <li key={2}>
                                <Link
                                    key={id}
                                    to={`/menubar/plan?id=${id}&type=edit`}
                                >
                                    编辑
                                </Link>
                            </li>
                            <li key={3} className="bg-error">
                                <form action="/menubar/update" method="post">
                                    <input className="hidden" name="id" defaultValue={id}/>
                                    <button type="submit" name="_action" value="delete">删除</button>
                                </form>
                            </li>
                        </ul>
                    </button>
                </div>
            </td>
        </tr>
    );
}