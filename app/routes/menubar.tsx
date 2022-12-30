// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Outlet} from "@remix-run/react";
import {AsideMenuBar} from "~/components/aside-menu-bar";
import {requireUserId} from "~/utils/auth.server";
import {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async ({request}) => {
    await requireUserId(request);
    return null;
}

export default function index() {
    return (
        <div className="container2">
            <div className="drawer-side">
                <label htmlFor="drawer-menu" className="drawer-overlay"/>
                <aside className="w-40 h-full bg-base-200">
                    <AsideMenuBar
                        menus={[
                            {to: "", name: "任务列表"},
                            {to: "add", name: "新建任务"},
                            {to: "aoe", name: "AOE图"},
                            {to: "priority", name: "优先级"},
                            {to: "/", name: "返回首页"}
                        ]}
                    />
                </aside>
            </div>
            <main className="w-full">
                <Outlet/>
            </main>
        </div>
    );
}
