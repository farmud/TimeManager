/* 表单数据规范 */

export type RegisterForm = {
    email: string;
    password: string;
    userName: string;
    name: string;
    identifyCode: string;
};

export type LoginForm = {
    email: string;
    password: string;
}


export type CreatePlanForm = {
    userId: string;
    name: string;
    startTime: Date;
    endTime: Date;
    status: number;
    content: string;
    parentId?: string;
}

export type UpdatePlanForm = {
    id: string;
    userId: string;
    name: string;
    startTime: Date;
    endTime: Date;
    status: number;
    content: string;
    parentId?: string;
}

export type SearchPlanForm = {
    userId: string;
    id?: string;
    name?: string;
    startTime?: Date;
    endTime?: Date;
    status?: number;
    content?: string;
    parentId?: string;
    children?: boolean;
    parent?: boolean;
}


export type CreateAoeGroupForm = {
    userId: string;
    name: string;
    content: string;
}

export type UpdateAoeGroupForm = {
    id: string;
    userId: string;
    name: string;
    content: string;
}

export type SearchAoeGroupForm = {
    userId: string;
    name?: string;
}


export type CreateAoePlanForm = {
    userId: string;
    name: string;
    content: string;
    groupId: string;
}

export type UpdateAoePlanForm = {
    id: string;
    userId: string;
    name: string;
    content: string;
    groupId: string;
}

export type SearchAoePlanForm = {
    userId: string;
    groupId: string;
    id?: string;
    name?: string;
    content?: string;
}


export type CreateAoeRelationForm = {
    userId: string;
    groupId: string;
    parentId: string;
    childId: string;
    day: number;
    hour: number;
    content: string;
}