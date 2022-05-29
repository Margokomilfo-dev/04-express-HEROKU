import {Request, Response, Router} from 'express'
import {
    basicAuth,
    contentValidation,
    getQueryPaginationFromQueryString,
    inputValidationMiddleware,
    nameValueValidation,
    shortDescriptionValidation,
    titleValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2
} from '../middlewares/input-validation-middleware'
import {bloggersService} from '../bll-domain/bloggers-service'
import {postService} from '../bll-domain/posts-service'

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const searchName = req.query.SearchNameTerm?.toString()
    const params = getQueryPaginationFromQueryString(req)
    const bloggers = await bloggersService.findBloggers(params.pageNumber, params.pageSize, searchName)
    res.status(200).send(bloggers)
})
bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.send(400)
        return
    }
    const blogger = await bloggersService.findBloggerById(id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }

})
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const bloggerId = req.params.bloggerId
    const params = getQueryPaginationFromQueryString(req)
    const blogger = await bloggersService.findBloggerById(bloggerId)
    if(!blogger){
        res.send(404)
        return
    }
    const postsByBloggerId = await postService.getPostsByBloggerId(params.pageNumber,params.pageSize, bloggerId)
    res.status(200).send(postsByBloggerId)
})

bloggersRouter.post('/',basicAuth,
    nameValueValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl
        const blogger = await bloggersService.createBlogger(name, youtubeUrl)

        if (blogger) {
            res.status(201).send(blogger)
        } else {
            res.status(400).send({
                resultCode: 1,
                errorsMessages: [{message: 'blogger is not created', field: 'bloggerId'}]
            })
        }
    })

bloggersRouter.post('/:bloggerId/posts',basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const bloggerId = req.params.bloggerId
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content

        const blogger = await bloggersService.findBloggerById(bloggerId)
        if(!blogger){
            res.send(404)
            return
        }

        if (blogger) {
            const post = await postService.createPost(title, shortDescription, content, bloggerId)
            res.status(201).send(post)
        } else {
            res.status(400).send({
                resultCode: 1,
                errorsMessages: [{message: 'post is not created', field: 'postId'}]
            })
        }
    })

bloggersRouter.put('/:id',basicAuth,
    nameValueValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            res.send(400)
            return
        }
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl

        const isUpdated = await bloggersService.updateBlogger(id, name, youtubeUrl)
        if (isUpdated) {
            res.sendStatus(204)
        } else res.send(404)
    })

bloggersRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.send(400)
        return
    }
    const isDeleted = await bloggersService.deleteBlogger(id)
    if (isDeleted) {
        res.send(204)
    } else res.send(404)
})

