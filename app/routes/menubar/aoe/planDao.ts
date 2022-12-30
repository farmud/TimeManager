import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {AoePlan} from "~/utils/aoe.server";
import {requireUserId} from "~/utils/auth.server";

export const loader: LoaderFunction = async () => redirect("/menubar/aoe");
export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const userId = await requireUserId(request);
    const action = form.get("_action");
    const name = form.get("name") as string;
    const content = form.get("content") as string;
    const groupId = form.get("groupId") as string;

    switch (action) {
        case "create":
            return await AoePlan.create({userId, name, content, groupId});
        case "update": {
            const id = form.get("id") as string;
            return await AoePlan.update({id, userId, name, content, groupId});
        }
        case "delete": {
            const id = form.get("id") as string;
            return await AoePlan.delete(id, groupId);
        }
        default:
            return redirect("/menubar/aoe");
    }
}