import {Request, Response, Router} from 'express'


import {bloggersRepository} from '../repositories/bloggers-db-repository'
import {
    basicAuth,
    bloggerIdValidation,
    contentValidation, getQueryPaginationFromQueryString, inputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from '../middlewares/input-validation-middleware'
import {postService} from '../bll-domain/posts-service'

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const params = getQueryPaginationFromQueryString(req)
    const posts = await postService.getPosts(params.pageNumber, params.pageSize)
    res.status(200).send(posts)
})
postsRouter.post('/', basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const bloggerId = req.body.bloggerId
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (!blogger) {
            res.status(400).send({
                resultCode: 1,
                errorsMessages: [{message: 'no blogger with this id', field: 'bloggerId'}]
            })
            return
        }
        const newPost = await postService.createPost(title, shortDescription, content, bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).send({
                resultCode: 1,
                errorsMessages: [{message: 'post is not created', field: 'bloggerId'}]
            })
        }
    })
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    if (!id) {
        res.send(400)
        return
    }
    const post = await postService.getPostById(id)
    if (post) {
        res.send(post)
    } else {
        res.send(404)
    }
})
postsRouter.put('/:id', basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const id = parseInt(req.params.id)
        if (!id) {
            res.send(400)
            return
        }
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const bloggerId = req.body.bloggerId

        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (!blogger) {
            res.status(400).send({
                resultCode: 1,
                errorsMessages: [{message: 'blogger is not created', field: 'bloggerId'}]
            })
            return
        }
        const isUpdated = await postService.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)
        if (isUpdated) {
            res.sendStatus(204)
        } else res.send(404)
    })
postsRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    if (!id) {
        res.send(400)
        return
    }
    const isDeleted = await postService.deletePost(id)
    if (isDeleted) {
        res.send(204)
    } else res.send(404)
})