import React, {useEffect, useRef, useState} from "react";
import {Form} from "@remix-run/react";
import {FormField} from "~/components/form/form-field";
import {AoeGroupList} from "~/components/aoe/aoe-group-list";

interface GroupProps {
    loaderData: any;
    actionData: any;
    onSelected: (...args: any[]) => any;
    value: string;
}

export default function Group({loaderData, actionData, onSelected, value}: GroupProps) {

    let data;
    if (actionData?.aoeGroupList)
        data = actionData;
    else
        data = loaderData;

    let ref = useRef<HTMLDivElement>(null);

    const [searchParams, setSearchParams] = useState({
        name: actionData ? actionData.name : undefined
    });
    const [error, setError] = useState(loaderData?.error);

    const handleSearch = (event: React.ChangeEvent<HTMLFormElement>) => {
        setSearchParams(searchParams => ({...searchParams, [event.target.name]: event.target.value}));
    }


    useEffect(() => {
        if (loaderData?.error) {
            const count = function (t: number) {
                let timer: string | number | NodeJS.Timeout | undefined;
                let i = 0;

                function change(tar: number) {
                    if (ref.current) {
                        const num = 1 - i / tar;
                        ref.current.style.opacity = num.toString();
                        if (i === tar) {
                            clearInterval(timer);
                            setError(undefined);
                            return false;
                        }
                        timer = setTimeout(function () {
                            change(tar);
                        }, i === 0 ? 1000 : 50);
                        i++;
                    }
                    return change;
                }

                change(t);
            };
            count(5);
        }
    })

    return (
        <>
            <div className="w-full h-20 grid grid-cols-8 bg-[#ffedd5] items-center">
                {error !== undefined &&
                    <>
                        <div ref={ref} className="toast toast-top toast-center w-32">
                            <div className="alert alert-error grid justify-around">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <label className="text-2xl font-bold text-center">任务组</label>
                <Form method="post" className="col-span-7 grid grid-cols-2">
                    <FormField
                        className="input input-bordered col-span-2 text-xs"
                        htmlFor="name"
                        label="任务组名称"
                        value={searchParams.name}
                        onChange={handleSearch}
                        hasError={false}
                        horizontal={false}
                    />
                    <div className="w-full grid justify-around items-center">
                        <div className="btn-group">
                            <button name="_action" value="searchGroups"
                                    className="btn btn-sm btn-primary border-r-black">查询
                            </button>
                            <button className="btn btn-sm btn-success border-l-black"
                                    onClick={() => setSearchParams({name: undefined})}>
                                重置
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
            <div className="w-full h-[81%] overflow-y-auto">
                <AoeGroupList
                    aoeItems={data.aoeGroupList}
                    onChange={onSelected}
                    value={value}
                />
            </div>
        </>
    );
};