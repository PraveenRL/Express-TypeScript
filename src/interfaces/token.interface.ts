export interface IToken {
    token: string;
    expiresIn: number;
}

export interface IDataStoredToken {
    _id: string;
}

export interface IRefreshToken{
    refreshToken: string;
}