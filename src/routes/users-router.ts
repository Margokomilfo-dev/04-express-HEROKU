import {Request, Response, Router} from 'express'
import {
    basicAuth,
    getQueryPaginationFromQueryString,
    inputValidationMiddleware,
    loginValidation,
    passwordValidation
} from '../middlewares/input-validation-middleware'
import {usersService} from '../bll-domain/users-service'

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    const params = getQueryPaginationFromQueryString(req)
    const users = await usersService.getUsers(params.pageNumber, params.pageSize)
    res.status(200).send(users)
})
usersRouter.post('/', basicAuth,  loginValidation, passwordValidation,  inputValidationMiddleware,  async (req: Request, res: Response) => {
    const login = req.body.login
    const password = req.body.password
    const foundUser = await usersService.findByCredentials(login, password)
    if (foundUser){
        res.sendStatus(400)
        return
    }
    const user = await usersService.createUser(login, password)
    res.status(201).send(user)
})
usersRouter.delete('/:id', basicAuth, async (req: Request, res: Response)=>{
    const id = +req.params.id
    if (!id) {
        res.send(400)
        return
    }
    const user = await usersService.getUserById(id)
    if(!user) {
        res.sendStatus(404)
        return
    }
    const isDeleted = await usersService.deleteUser(id.toString().trim())
    if(isDeleted){
        res.sendStatus(204)
    }else res.sendStatus(400) //!!!!!!!!!!!!!!
})