import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {completePlan, deletePlan} from "~/utils/plan.server";

export const loader: LoaderFunction = async () => redirect("/menubar");
export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    const id = form.get("id") as string;
    if (id) {
        const action = form.get("_action");
        switch (action) {
            case "complete":
                return completePlan(id);
            case "delete":
                return deletePlan(id);
            default:
                return redirect("/menubar");
        }
    }
    return redirect("/menubar");
}