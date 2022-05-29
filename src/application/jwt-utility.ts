import {ObjectId} from 'mongodb'
import jwt from 'jsonwebtoken'
import {settings} from '../settings'
import {UserType} from '../repositories/users-db-repository'

export const jwtUtility = {
    async createJWT(user: UserType) {
        return  jwt.sign({userId:  user._id}, settings.JWT_SECRET, { expiresIn: "1 day" });
    },
    async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}
