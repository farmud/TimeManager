import type {LoginForm, RegisterForm} from './types.server';
import {prisma} from "~/utils/prisma.server";
import {createCookieSessionStorage, json, redirect} from "@remix-run/node";
import {createUser} from "~/utils/user.server";
import bcrypt from "bcryptjs";

/* 基础服务 */

export async function register(user: RegisterForm, redirectTo: string = '/') {
    const flag = await validateIdentifyCode(user.email, user.identifyCode);
    if (!flag)
        return json({
                error: "验证码错误",
                fields: {email: user.email, password: user.password, userName: user.userName, name: user.name},
                form: 'register',
            },
            {status: 400},
        );

    const newUser = await createUser(user);
    if (!newUser) {
        return json({
                error: "注册失败",
                fields: {email: user.email, password: user.password, userName: user.userName, name: user.name},
                form: 'register',
            },
            {status: 400},
        );
    }
    return createUserSession(newUser.id, redirectTo);
}

export async function login({email, password}: LoginForm, redirectTo: string = '/menubar') {
    const user = await prisma.user.findFirst({
        where: {email: email, delFlag: false},
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({
            error: "用户名或密码错误",
            fields: {email: email, password: password},
            form: 'login'
        }, {status: 400});
    }

    return createUserSession(user.id, redirectTo);
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("Missing SESSION_SECRET env variable");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: 'time-manager-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set('userId', userId);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    });
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string' || !await prisma.user.findFirst({where: {id: userId, delFlag: false}})) {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'));
}

async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') return null;
    return userId;
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== 'string') return null;

    try {
        return await prisma.user.findFirst({
            where: {id: userId, delFlag: false},
            select: {id: true, email: true, userName: true},
        });
    } catch {
        return logout(request);
    }
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    });
}

async function validateIdentifyCode(email: string, identifyCode: string) {
    const codeData = await prisma.identifyCode.findFirst({where: {email: email, delFlag: false}});
    const code = codeData?.code;
    if (identifyCode !== code)
        return false;
    else {
        const date = codeData?.updatedTime.getTime() || 0;
        const now = Date.now();
        return now - date <= 1000 * 60 * 10;
    }
}

export function uuid(len: number | undefined = undefined, radix: number | undefined = undefined) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}