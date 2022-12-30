import type {LinksFunction, LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import styles from "./styles/app.css"
import {getUser} from "~/utils/auth.server";
import React, {useEffect, useState} from "react";


export const links: LinksFunction = () => {
    return [{rel: "stylesheet", href: styles}]
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Time Manager",
    viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({request}) => {
    const user = await getUser(request);
    return json({loggedIn: !!user, user: user});
}

export default function App() {
    const loaderData = useLoaderData();
    const [time, setTime] = useState(new Date().toLocaleString());

    useEffect(() => {
        setInterval(_=>setTime(new Date().toLocaleString()), 1000);
    });

    return (
        <html lang="ch" data-theme="cupcake">
        <head>
            <Meta/>
            <Links/>
            <title>Time Manager</title>
        </head>
        <body className="page">
        <div className="top-0 items-center gap-2 px-4 py-2 lg:flex navbar-first">
            <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/">
                <span className="text-primary">Time</span>
                <span>Manager</span>
            </Link>
            <div className="flex-1 text-3xl btn btn-ghost">
                <span>当前时间：{time}</span>
            </div>
            {loaderData.loggedIn &&
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://www.dmoe.cc/random.php" alt="头像"/>
                        </div>
                    </label>
                    <form action="/menu" method="POST">
                        <ul tabIndex={0}
                            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-64">
                            <li>
                                <div className="grid grid-flow-row-dense grid-cols-4 gap-4">
                                    <div className="avatar-holder">
                                        <div className="avatar">
                                            <div className="mask mask-squircle">
                                                <img src="https://www.dmoe.cc/random.php" alt="头像"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 user-info">
                                        <div>{loaderData.user.userName}</div>
                                        <div className=" text-xs">{loaderData.user.email}</div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button className="justify-between" type="submit" name="_action" value="profile">
                                    我的
                                    <span className="badge">新增</span>
                                </button>
                            </li>
                            <li>
                                <button type="submit" name="_action" value="settings">设置</button>
                            </li>
                            <li>
                                <button type="submit" name="_action" value="logout">退出</button>
                            </li>
                        </ul>
                    </form>
                </div>
            }
        </div>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
