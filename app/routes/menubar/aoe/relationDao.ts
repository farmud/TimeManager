import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {AoeRelation} from "~/utils/aoe.server";
import {requireUserId} from "~/utils/auth.server";

export const loader: LoaderFunction = async () => redirect("/menubar/aoe");
export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const action = form.get("_action");
    const userId = await requireUserId(request);
    const groupId = form.get("groupId") as string;

    switch (action) {
        case "create":{
            const parentId = form.get("parentId") as string;
            const childId = form.get("childId") as string;
            const day = parseInt(form.get("day") as string);
            const hour = parseInt(form.get("hour") as string);
            const content = form.get("content") as string;
            return await AoeRelation.create({userId, groupId, parentId, childId, day, hour, content});
        }
        case "delete": {
            const id = form.get("id") as string;
            return await AoeRelation.delete(id, groupId);
        }
        default:
            return redirect("/menubar/aoe");
    }
}