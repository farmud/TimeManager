export interface ItemSmProps {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    status: number;
    num: number;
    itemName: string;
    checked: boolean;
    onChange?: (...args: any) => any;
    readonly?: boolean;
}

export function ItemSm({
                           id,
                           name,
                           startTime,
                           endTime,
                           status,
                           num,
                           itemName,
                           checked,
                           onChange = () => {
                           },
                           readonly = false,
                       }: ItemSmProps) {
    let importance: () => JSX.Element;
    importance = () => {
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
                return <div className="badge bg-gray-300 text-black border-0">无</div>;
        }
    };
    startTime = new Date(startTime);
    endTime = new Date(endTime);
    return (
        <tr className="items-center hover">
            <th>
                <label>
                    <input
                        type="radio"
                        className="radio"
                        name={itemName}
                        value={id}
                        checked={checked}
                        onChange={onChange}
                        disabled={readonly}
                    />
                </label>
            </th>
            <td className="text-center">{num}</td>
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
        </tr>
    );
}