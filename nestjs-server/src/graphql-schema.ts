
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface User {
    _id: string;
    email: string;
    password?: Nullable<string>;
    confirmationCode?: Nullable<string>;
    confirmed: boolean;
}

export interface IQuery {
    confirmUser(email: string, token: string): User | Promise<User>;
}

type Nullable<T> = T | null;
