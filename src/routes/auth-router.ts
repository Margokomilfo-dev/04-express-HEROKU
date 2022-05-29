import {Request, Response, Router} from 'express'
import {
    inputValidationMiddleware,
    loginValidation,
    passwordValidation
} from '../middlewares/input-validation-middleware'
import {authService} from '../bll-domain/auth-service'

export const authRouter = Router({})

authRouter.post('/login', loginValidation, passwordValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const login = req.body.login
    const password = req.body.password
    const result = await authService.checkCredentials(login, password)

    if (!result) {
        res.sendStatus(401)
        return
    }else
    res.status(200).send({token: result})
})