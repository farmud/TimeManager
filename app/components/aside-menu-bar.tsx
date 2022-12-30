import {Link} from "@remix-run/react";
import React from "react";

interface AsideMenuBarProps {
    menus: AsideMenu[];
}

interface AsideMenu {
    to: string;
    name: string;
}

export function AsideMenuBar({menus}: AsideMenuBarProps) {
    const list = menus.map((item: AsideMenu, index: number) => {
        return (<li className="w-full" key={index}>
            <Link to={menus[index].to}
                  className="grid">
                <span className="text-center">{menus[index].name}</span>
            </Link>
        </li>);
    });

    return (
        <>
            <ul className="menu p-4 overflow-y-auto w-40 text-base-content items-center">
                {list}
            </ul>
        </>
    );
}