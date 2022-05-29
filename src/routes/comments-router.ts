import {Request, Response, Router} from 'express'
import {commentsService} from '../bll-domain/comments-service'
import {
    bearerAuth,
    commentContentValidation,
    inputValidationMiddleware
} from '../middlewares/input-validation-middleware'

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.send(404)
        return
    }
    const comment = await commentsService.getComment(id)
    if(!comment){
        res.sendStatus(404)
    }else res.status(200).send(comment)
})
commentsRouter.put('/:commentId', bearerAuth, commentContentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    if (!commentId) {
        res.send(404)
        return
    }
    const comment = await commentsService.getComment(commentId)
    if(!comment){
        res.sendStatus(404)
        return
    }
    if(comment?.userId!== req.user?.id) {
        res.sendStatus(403)
        return
    }
    const content = req.body.content
    const isUpdated = await commentsService.updateCommentById(commentId, content)
    if(isUpdated) {
        res.sendStatus(204)
    }else res.sendStatus(404)

})

commentsRouter.delete('/:commentId', bearerAuth, async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    if (!commentId) {
        res.send(404)
        return
    }
    const comment = await commentsService.getComment(commentId)
    if(!comment){
        res.sendStatus(404)
        return
    }
    if(comment?.userId!== req.user?.id) {
        res.sendStatus(403)
        return
    }
    const isDeleted = await commentsService.deleteComment(commentId)
    if(isDeleted){
        res.sendStatus(204)
    } else res.status(404)
})
