
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface User {
    _id: string;
    email: string;
    password?: Nullable<string>;
    confirmationCode?: Nullable<string>;
    confirmed: boolean;
    roles?: Nullable<Nullable<Role>[]>;
}

export interface IQuery {
    confirmUser(email: string, token: string): User | Promise<User>;
}

type Nullable<T> = T | null;
