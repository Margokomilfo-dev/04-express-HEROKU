import {users} from './db'
import {ObjectId, WithId} from 'mongodb'
export type UserType = WithId<{
    id: string,
    login: string
    passwordHash: string
}>

export const usersRepository = {
    async getUsers(pageNumber:number, pageSize:number,): Promise<Array<UserType>> {
        return users.find({}, {projection:{_id:0, passwordHash:0}}).skip(pageSize*(pageNumber-1)).limit(pageSize).toArray()
    },
    async getUsersCount(): Promise<number> {
        return users.countDocuments()
    },
    async findUserByLogin(login: string): Promise<UserType | null>{
        return users.findOne({login})
    },
    async createUser(user: UserType): Promise<{ id: string, login:string}>{
        await users.insertOne(user)
        return {
            id: user.id,
            login: user.login,
        }
    },
    async deleteUser(id: string): Promise<boolean>{
        const res = await users.findOneAndDelete({id})
        return res.value !== null
    },
    async getUserById(userId: number): Promise<UserType | null>{
        const id = userId.toString().trim()
        return await users.findOne({id})
    },
    async getUserBy_Id(_id: ObjectId): Promise<UserType | null>{
        return await users.findOne({_id})
    },
}