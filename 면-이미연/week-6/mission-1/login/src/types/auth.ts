export interface RequestSigninDto {
    email: string;
    password: string;
}

export interface RequestSignupDto {
    email: string;
    password: string;
    name: string;
    nickname?: string;
}

export interface BaseResponse {
    status: boolean;
    statusCode: number;
    message: string;
}

export interface ResponseSigninDto extends BaseResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ResponseMyInfoDto extends BaseResponse {
    data: {
        id: number;
        email: string;
        name: string;
        nickname?: string;
        avatar?: string | null;
    };
}

export interface ResponseSignupDto extends BaseResponse {
    data: {
        id: number;
        email: string;
        name: string;
        nickname?: string;
    };
}
