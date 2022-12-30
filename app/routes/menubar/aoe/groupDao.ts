import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {AoeGroup} from "~/utils/aoe.server";
import {requireUserId} from "~/utils/auth.server";

export const loader: LoaderFunction = async () => redirect("/menubar/aoe");
export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const userId = await requireUserId(request);
    const action = form.get("_action");
    const name = form.get("name") as string;
    const content = form.get("content") as string;

    switch (action) {
        case "create":
            return await AoeGroup.create({userId, name, content});
        case "update": {
            const id = form.get("id") as string;
            return await AoeGroup.update({id, userId, name, content});
        }
        case "delete": {
            const id = form.get("id") as string;
            return await AoeGroup.delete(id);
        }
        default:
            return redirect("/menubar/aoe");
    }
}