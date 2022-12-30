import React, {useState} from "react";
import {Form} from "@remix-run/react";
import {FormField} from "~/components/form/form-field";
import {AoePlanList} from "~/components/aoe/aoe-plan-list";

interface PlansProps {
    loaderData: any;
    actionData: any;
    groupId: string;
}

export default function Plans({loaderData, actionData, groupId}: PlansProps) {
    let aoePlanList = actionData?.aoePlanList ? actionData.aoePlanList : loaderData.aoePlanList;

    const [searchParams, setSearchParams] = useState({
        name: actionData ? actionData.name : undefined
    });

    const handleSearch = (event: React.ChangeEvent<HTMLFormElement>) => {
        setSearchParams(searchParams => ({...searchParams, [event.target.name]: event.target.value}));
    }

    return (
        <>
            <div className="w-full h-20 grid grid-cols-8 bg-[#ffedd5] items-center">
                <label className="text-2xl font-bold text-center">节点列表</label>
                <Form method="post" className="col-span-7 grid grid-cols-2">
                    <input type="hidden" name="groupId" value={groupId}/>
                    <FormField
                        className="input input-bordered col-span-2 text-xs"
                        htmlFor="name"
                        label="节点名称"
                        value={searchParams.name}
                        onChange={(event) => handleSearch(event)}
                        hasError={false}
                        horizontal={false}
                    />
                    <div className="w-full grid justify-around items-center">
                        <div className="btn-group">
                            <button name="_action" value="searchPlans"
                                    className="btn btn-sm btn-primary border-r-black">查询
                            </button>
                            <button name="_action" value="searchPlans" className="btn btn-sm btn-success border-l-black"
                                    onClick={() => setSearchParams({name: undefined})}>重置
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
            <div className="w-full h-[81%] overflow-y-auto">
                <AoePlanList aoeItems={aoePlanList} groupId={groupId}/>
            </div>
        </>
    );
};