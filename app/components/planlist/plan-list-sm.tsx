import type {ItemProps} from "~/components/planlist/item";
import {ItemSm} from "~/components/planlist/item-sm";

interface PlayListSmProps {
    items: ItemProps[];
    name: string;
    value: string | undefined;
    onChange?: (...args: any) => any;
    readonly?: boolean;
}

export function PlayListSm({
                               items,
                               name,
                               value,
                               onChange = () => {
                               },
                               readonly = false,
                           }: PlayListSmProps) {
    const list = items.map((item: ItemProps) => {
            return (
                <ItemSm
                    id={item.id}
                    name={item.name}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    status={item.status}
                    key={item.id}
                    num={item.num}
                    itemName={name}
                    checked={item.id === value}
                    onChange={onChange}
                    readonly={readonly}
                />
            )
        }
    )

    return (
        <>
            <table className="table table-compact w-full h-full">
                <thead>
                <tr className="items-center">
                    <th>
                        <label>
                            <input type="radio" className="radio" value={undefined} checked={false} onChange={onChange} disabled={readonly} name={name}/>
                        </label>
                    </th>
                    <th className="text-center">序号</th>
                    <th className="text-center">任务名称</th>
                    <th className="text-center">任务时间</th>
                    <th className="text-center">任务优先级</th>
                </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </table>
        </>
    );
}
