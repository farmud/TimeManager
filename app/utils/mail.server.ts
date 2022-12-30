import {prisma} from "~/utils/prisma.server";
import nodemailer from 'nodemailer';
import type {Options} from "nodemailer/lib/mailer";

/* 邮件服务 */

export async function getIdentifyCode(email: string) {
    const identifyCode = Math.random().toString().slice(-6);
    const exists = await prisma.identifyCode.count({where: {email: email}});
    if (exists) {
        await prisma.identifyCode.update({
            where: {email: email},
            data: {
                email: undefined,
                code: identifyCode,
            }
        })
    } else {
        await prisma.identifyCode.create({
            data: {
                email: email,
                code: identifyCode,
            }
        })
    }

    return sendRegisterMail(email, identifyCode);
}

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hitwhfp@163.com',
        pass: 'XQQYPHDKKZXQAVLJ',
    },
});

export async function sendRegisterMail(email: string, code: string) {
    const params = {
        from: 'hitwhFP<hitwhfp@163.com>',
        to: email,
        subject: 'TimeManager注册验证码',
        text: `您的验证码为${code}，请在10分钟内完成注册。`,
    };
    return sendMsg(params);
}

const sendMsg = (params: Options) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(params, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
            transporter.close();
        });
    })
}