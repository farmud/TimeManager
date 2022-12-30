interface SelectFieldProps {
    htmlFor: string;
    label: string;
    tips?: string;
    value: any;
    onChange?: (...args: any) => any;
    args: OptionFieldProps[];
    horizontal?: boolean;
    readonly?: boolean;
}

export interface OptionFieldProps {
    value: any;
    label: string;
}

export function SelectField({
                                htmlFor,
                                label,
                                tips = '',
                                value,
                                onChange = () => {
                                },
                                args,
                                horizontal = true,
                                readonly = false,
                            }: SelectFieldProps) {
    let i = 0;
    const options = args.map((item: OptionFieldProps) => {
        return <option value={item.value} key={i++}>{item.label}</option>
    });

    return (
        <>
            <div className={horizontal ? "form-control" : "form-control grid grid-cols-3 gap-2"}>
                <label htmlFor={htmlFor} className='label'>
                    <span className={horizontal ? "w-full label-text" : "w-full label-text text-right"}>{label}</span>
                </label>
                <select className="select select-bordered w-full col-span-2" id={htmlFor} name={htmlFor} value={value}
                        onChange={onChange} disabled={readonly}>
                    {tips !== '' && <option value='' disabled>{tips}</option>}
                    {options}
                </select>
            </div>
        </>
    );
}