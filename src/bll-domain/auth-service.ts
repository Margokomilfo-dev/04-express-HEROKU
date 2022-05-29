import {usersService} from './users-service'
import {jwtUtility} from '../application/jwt-utility'

export const authService = {
    async checkCredentials(login: string, password: string): Promise<string | null> {
        const user = await usersService.findByCredentials(login,password)
        if (!user) {
            return null
        }
        const token = jwtUtility.createJWT(user)
        return token
    }
}