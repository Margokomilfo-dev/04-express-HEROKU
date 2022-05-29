import {usersRepository, UserType} from '../repositories/users-db-repository'
import bcrypt from 'bcrypt'
import {ObjectId} from 'mongodb'

export const usersService = {
    async getUsers (pageNumber:number, pageSize:number) {
        const users = await usersRepository.getUsers(pageNumber, pageSize)
        const usersCount = await usersRepository.getUsersCount()
        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users
        }
    },
    async createUser (login: string, password: string) {
        const passwordHash = await this.generateHash(password)
        const user = {
            _id: new ObjectId(),
            id: new Date().getTime().toString(),
            login,
            passwordHash
        }
      return usersRepository.createUser(user)
    },
    async deleteUser (id:string): Promise<boolean> {
        return  usersRepository.deleteUser(id)
    },
    async getUserBy_id (_id:ObjectId): Promise<UserType | null> {
        return  usersRepository.getUserBy_Id(_id)
    },
    async findByCredentials(login: string, password: string): Promise<UserType | null>{
       const user = await usersRepository.findUserByLogin(login)
        if(!user) return null
        const isHashesEquals = await this.isPasswordCorrect(password, user.passwordHash)
        if (isHashesEquals) {
            return user
        } else {
            return null
        }
    },

    async getUserById(id: number): Promise<UserType | null>{
        return await usersRepository.getUserById(id)
    },
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async isPasswordCorrect(password: string, hash2: string) {
        const isEqual = await bcrypt.compare(password, hash2)
        return isEqual
    },
}