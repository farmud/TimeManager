import {useRef} from "react";

interface UploadFieldProps {
    htmlFor: string;
    label: string;
    value?: any;
    onChange?: (...args: any) => any;
}

export function UploadField({
                                htmlFor,
                                label,
                                value,
                                onChange = () => {
                                },
                            }: UploadFieldProps) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className="form-control">
                <label htmlFor={htmlFor} className='label'>
                    <span className="label-text">{label}</span>
                </label>
                <input
                    type="file"
                    id={htmlFor}
                    name={htmlFor}
                    value={value}
                    hidden
                    ref={ref}
                    onChange={onChange}
                />
                <button
                    className="btn btn-primary w-96"
                    type="button"
                    onClick={() => ref.current?.click()}
                >
                    <span>选择文件</span>
                </button>
                {ref.current?.files?.item(0)?.name &&
                    <div className='alert'>
                        {ref.current?.files?.item(0)?.name}
                    </div>
                }
            </div>
        </>
    );
}