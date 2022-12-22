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

export class User {
    _id: string;
    email: string;
    password?: Nullable<string>;
    confirmationCode?: Nullable<string>;
    confirmed: boolean;
    roles?: Nullable<Nullable<Role>[]>;
}

export abstract class IQuery {
    abstract confirmUser(email: string, token: string): User | Promise<User>;
}

type Nullable<T> = T | null;
