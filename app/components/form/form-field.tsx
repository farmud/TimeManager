import {useEffect, useState} from "react";

interface FormFieldProps {
    className?: string;
    htmlFor: string;
    label: string;
    type?: string;
    value: any;
    onChange?: (...args: any) => any;
    error?: string;
    hasError?: boolean;
    horizontal?: boolean;
    textarea?: boolean;
    readonly?: boolean;
}

export function FormField({
                              className = 'input input-bordered col-span-2',
                              htmlFor,
                              label,
                              type = 'text',
                              value = '',
                              onChange = () => {
                              },
                              error = '',
                              hasError = true,
                              horizontal = true,
                              textarea = false,
                              readonly = false,
                          }: FormFieldProps) {
    const [errorText, setErrorText] = useState(error);

    useEffect(() => {
        setErrorText(error);
    }, [error]);
    return (
        <>
            <div className={horizontal ? "form-control" : "form-control grid grid-cols-3 gap-2"}>
                <label htmlFor={htmlFor} className="label">
                    <span className={horizontal ? "w-full label-text" : "w-full label-text text-right"}>{label}</span>
                </label>
                {textarea ? (
                    <textarea onChange={e => onChange(e)} id={htmlFor} name={htmlFor} className={className}
                              value={value} readOnly={readonly}/>
                ) : (
                    <input onChange={e => {
                        onChange(e);
                        setErrorText('');
                    }} type={type} id={htmlFor} name={htmlFor} className={className} value={value} readOnly={readonly}/>
                )}
            </div>
            {hasError && (
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                    {errorText || ''}
                </div>
            )}
        </>
    );
}