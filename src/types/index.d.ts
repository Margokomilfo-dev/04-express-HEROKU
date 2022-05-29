import {UserType} from '../repositories/users-db-repository'

declare global {
    declare namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}
