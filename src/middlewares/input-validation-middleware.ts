import {NextFunction, Request, Response} from 'express'
import {body, validationResult} from 'express-validator'
import {jwtUtility} from '../application/jwt-utility'
import {usersService} from '../bll-domain/users-service'

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let newErrors = errors.array()
        let countYoutubeUrl = 0
        errors.array().forEach(e => e.param === 'youtubeUrl' && countYoutubeUrl++)
        if (countYoutubeUrl > 1) {
            newErrors = errors.array().filter((e) => !(e.param === 'youtubeUrl' && e.msg.includes('length 2-100 ')))
        }
        res.status(400).json({
            resultCode: 1,
            errorsMessages: newErrors.map((e) => ({
                message: e.msg,
                field: e.param
            }))
        })
    } else {
        next()
    }
}
export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let newErrors = errors.array()
        res.sendStatus(401)
    } else {
        next()
    }
}
const credentials = {
    login: 'admin',
    password: 'qwerty'
}
let data = `${credentials.login}:${credentials.password}`


export let basicAuth = (req: Request, res: Response, next: NextFunction) => {
    let buff = Buffer.from(data) //string from auth - hcsakj23nj
    let base64data = buff.toString('base64') //закодированная string под base64
    const validAuthValue = `Basic ${base64data}` //вся кодировка 'Basic  SDGSNstnsdgn' (admin:qwerty)

    let authHeader = req.headers.authorization

    if (authHeader && authHeader === validAuthValue) {
        next()
    } else res.sendStatus(401)
}

export let bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1] //deleted Bearer
    const userId = await jwtUtility.extractUserIdFromToken(token)
    if (userId) {
        const user = await usersService.getUserBy_id(userId)
        if (user) {
            req.user = user
            next()
            return
        } else {
            res.sendStatus(401)
            return
        }
    } else {
        res.sendStatus(401)
        return
    }
}


export const getQueryPaginationFromQueryString = (req: Request) => {
    const pageNumber = req.query.PageNumber && typeof (req.query.PageNumber) === 'string' && (isFinite(parseInt(req.query.PageNumber))) ? parseInt(req.query.PageNumber) : 1
    const pageSize = req.query.PageSize && typeof (req.query.PageSize) === 'string' && (isFinite(parseInt(req.query.PageSize))) ? parseInt(req.query.PageSize) : 10
    return {pageNumber, pageSize}
}
const regexp = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const titleValidation = body('title').trim().isLength({min: 2, max: 30})
    .withMessage('title is required and its length should be 2-30 symbols')
export const nameValueValidation = body('name').trim().isLength({min: 2, max: 15})
    .withMessage('name is required and its length should be 2-15symbols')
export const youtubeUrlValidation1 = body('youtubeUrl').isLength({min: 2, max: 100})
    .withMessage('UrlValidations length should be 2-100 symbols')
export const youtubeUrlValidation2 = body('youtubeUrl').matches(regexp)
    .withMessage('UrlValidation is required, length 2-100 and its pattern:' +
        ' ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n')
export const shortDescriptionValidation = body('shortDescription').trim().isLength({min: 2, max: 100})
    .withMessage('shortDescription is required and its Klength should be 2-100 symbols')
export const contentValidation = body('content').trim().isLength({min: 2, max: 1000})
    .withMessage('content is required and its length should be 2-100 symbols')
export const bloggerIdValidation = body('bloggerId').isNumeric()
    .withMessage('bloggerId is required and its number')

export const loginValidation = body('login').trim().isLength({min: 3, max: 10})
    .withMessage('login is required and its length should be 3-10 symbols')
export const passwordValidation = body('password').trim().isLength({min: 6, max: 20})
    .withMessage('password is required and its length should be 6-20 symbols')

export const commentContentValidation = body('content').trim().isLength({min: 20, max: 300})
    .withMessage('content is required and its length should be 20-300 symbols')
