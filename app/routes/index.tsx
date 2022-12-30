import {Link} from "react-router-dom";
import type {LoaderFunction} from "@remix-run/node";
import {requireUserId} from "~/utils/auth.server";
import React from "react";

export const loader: LoaderFunction = async ({request}) => {
    await requireUserId(request);
    return null;
}

export default function Index() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md grid gap-10">
                    <h1 className="text-4xl font-bold">
                        <span>欢迎来到</span>
                        <span className="text-primary font-semibold">任务</span>
                        <span className="text-[#1f2937] font-semibold">管理</span>
                        <span className="text-[#f97316] font-semibold">系统</span>
                    </h1>
                    <Link className="items-center" to='menubar'>
                        <button className="btn btn-lg btn-info shadow">点击按钮进入计划界面</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
