import React from "react";

export function Layout({children}: { children: React.ReactNode }) {
    return <div className="hero min-h-screen bg-base-200 overflow-auto">{children}</div>;
}