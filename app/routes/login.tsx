// noinspection JSUnusedGlobalSymbols
import React, {useEffect, useRef, useState} from "react";
import {Layout} from "~/components/layout";
import {FormField} from "~/components/form/form-field";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {UserValidator} from "~/utils/validators.server";
import {getUser, login, register} from "~/utils/auth.server";
import {useActionData, useTransition} from "@remix-run/react";
import {getIdentifyCode} from "~/utils/mail.server";

export const loader: LoaderFunction = async ({request}) => {
    return (await getUser(request)) ? redirect("/") : null;
}

export const action: ActionFunction = async ({request}) => {
    const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";
    const form = await request.formData();
    const action = form.get("_action");
    const email = form.get("email");
    const password = form.get("password");
    let userName = form.get("userName");
    let name = form.get("name");
    let identifyCode = form.get("identifyCode");

    if (typeof action !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return json({error: "不正确的数据格式", form: action}, {status: 400});
    }

    if (action === 'register' && (typeof userName !== 'string' || typeof name !== 'string')) {
        return json({error: "不正确的数据格式", form: action}, {status: 400});
    }

    let errors;
    if (action !== 'get-identify-code') {
        errors = {
            email: action === 'login' ? await UserValidator.validateEmail(email) : await UserValidator.validateEmail(email, true),
            password: UserValidator.validatePassword(password),
            ...(action === 'register'
                ? {
                    userName: UserValidator.validateUserName((userName as string) || ''),
                    name: UserValidator.validateName((name as string) || ''),
                    identifyCode: UserValidator.validateIdentifyCode((identifyCode as string) || ''),
                }
                : {}),
        }
    } else {
        errors = {
            email: await UserValidator.validateEmail(email),
        }
    }

    if (Object.values(errors).some(Boolean)) {
        return json({errors, fields: {email, password, userName, name, identifyCode}, form: action}, {status: 400});
    }

    switch (action) {
        case 'login': {
            return await login({email, password}, redirectTo);
        }
        case 'register': {
            userName = userName as string;
            name = name as string;
            identifyCode = identifyCode as string;
            return await register({email, password, userName, name, identifyCode}, redirectTo);

        }
        case 'get-identify-code': {
            const res = await getIdentifyCode(email);
            let success = false;
            // @ts-ignore
            if (res?.accepted[0] === email)
                success = true;
            return json({
                fields: {email, password, userName, name, identifyCode},
                form: action,
                success: success
            }, {status: success ? 200 : 400});
        }
        default: {
            return json({error: "不正确的数据格式"}, {status: 400});
        }
    }
};

export default function Login() {
    const firstLoad = useRef(true);
    const actionData = useActionData();
    const onLoad = Boolean(useTransition().submission);

    const [action, setAction] = useState(() => {
        if (actionData?.form) {
            if (actionData.form === 'login')
                return 'login';
            else
                return 'register';
        } else {
            return 'login';
        }
    });

    //This part is the get identify code part
    //maintained by: Yang zengyan
    const [btnClass, setBtnClass] = useState(() => {
        if (actionData?.form) {
            if (actionData.form === 'get-identify-code' && actionData.success === true) {
                return "btn btn-accent w-1/3 btn-disabled";
            } else
                return "btn btn-accent w-1/3 ";
        } else {
            return "btn btn-accent w-1/3 ";
        }
    })

    const [time, setTime] = useState(60);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let timeSet: NodeJS.Timer;

    useEffect(() => {
        if (btnClass === "btn btn-accent w-1/3 btn-disabled") {
            setTime(60);
        }

    }, [btnClass, setBtnClass])

    useEffect(function () {
        if (btnClass === "btn btn-accent w-1/3 btn-disabled" && time > 0)
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timeSet = setTimeout(() => {
                setTime(time => time - 1)
            }, 1000)
        if (time === 0) {
            setBtnClass("btn btn-accent w-1/3 ")
        }
    }, [time, setTime])
    //end of get identify code part

    const [errors, setErrors] = useState(actionData?.errors || {});
    const [formError, setFormError] = useState(actionData?.error || '');
    const [formData, setFormData] = useState({
        email: actionData?.fields?.email || '',
        password: actionData?.fields?.password || '',
        userName: actionData?.fields?.userName || '',
        name: actionData?.fields?.name || '',
        identifyCode: actionData?.fields?.identifyCode || '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        setFormData(form => ({...form, [event.target.name]: event.target.value}));
    };

    useEffect(() => {
        if (!firstLoad.current) {
            const newState = {
                email: '',
                password: '',
                userName: '',
                name: '',
                identifyCode: '',
            };
            setErrors(newState);
            setFormError('');
            if (actionData?.form === undefined || actionData?.form !== 'get-identify-code') {
                setFormData(newState);
            }
        }
        if (actionData && action === actionData.form) {
            setErrors(actionData.errors || {});
            setFormError(actionData.error || '');
        }
    }, [action, actionData]);

    useEffect(() => {
        if (!firstLoad.current) {
            setFormError('');
        }
    }, [formData]);

    useEffect(() => {
        if (formData.identifyCode !== '') {
            setErrors((errors: any) => ({...errors, identifyCode: ''}));
        }
    }, [formData.identifyCode]);

    useEffect(() => {
        firstLoad.current = false;
    }, []);

    return (
        <Layout>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Welcome To Time Manager!</h1>
                    <p className="py-6">Login in to plan your day!</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <form method="POST">
                            <div
                                className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
                            <FormField
                                htmlFor="email"
                                label="邮箱"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={errors?.email}
                            />
                            <FormField
                                htmlFor="password"
                                label="密码"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={errors?.password}
                            />
                            {action === "login" && (<label className="label">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a href="#" className="label-text-alt link link-hover" onClick={() => {
                                    setAction("register");
                                }}>Click here to register!</a>
                            </label>)
                            }
                            {action === "register" && (
                                <>
                                    <FormField
                                        htmlFor="userName"
                                        label="用户名"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        error={errors?.userName}
                                    />
                                    <FormField
                                        htmlFor="name"
                                        label="真实姓名"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={errors?.name}
                                    />
                                    <>
                                        <div className="container3">
                                            <label className="label">
                                                <span className="label-text"> 验证码</span>
                                            </label>
                                            <div className="input-group">
                                                <input onChange={e => handleInputChange(e as any)} type='text'
                                                       id="identifyCode" name="identifyCode"
                                                       className="input input-bordered w-2/3 "
                                                       value={formData.identifyCode}/>
                                                <button type="submit" name="_action" value="get-identify-code"
                                                        className={btnClass}>
                                                    {btnClass === "btn btn-accent w-1/3 " ? '获取验证码' : time + '秒重试'}
                                                </button>
                                            </div>

                                        </div>
                                        <div
                                            className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                                            {errors?.identifyCode || ''}
                                        </div>
                                    </>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" className="label-text-alt link link-hover"
                                       onClick={() => setAction("login")}>Back</a>
                                </>
                            )}
                            <div className="form-control mt-6">
                                <button type="submit" name="_action" value={action} className="btn btn-primary"
                                        disabled={onLoad}>
                                    {action === "login" ? (onLoad ? "登录中..." : "登录") : (onLoad ? "注册中..." : "注册")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}