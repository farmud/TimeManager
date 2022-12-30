import {prisma} from "~/utils/prisma.server";

/*注册登录表单验证*/

export class UserValidator {
    static async validateEmail(email: string, register: boolean = false): Promise<string | undefined> {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.length || !validRegex.test(email)) {
            return "请输入正确的邮箱地址";
        } else if (register) {
            const exists = await prisma.user.count({where: {email: email}});
            if (exists) {
                return "该邮箱已被注册过";
            }
        }
    }

    static validatePassword = (password: string): string | undefined => {
        if (password.length < 5) {
            return "密码长度至少为5位";
        }
    }

    static validateUserName = (userName: string): string | undefined => {
        if (!userName.length) {
            return "用户名不能为空";
        }
    }

    static validateName = (name: string): string | undefined => {
        if (!name.length) {
            return "姓名不能为空";
        } else {
            const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (!reg.test(name)) {
                return "姓名必须为中文";
            }
        }
    }

    static validateIdentifyCode = (identifyCode: string): string | undefined => {
        if (!identifyCode.length) {
            return "验证码不能为空";
        }
    }
}