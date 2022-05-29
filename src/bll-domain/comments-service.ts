import {commentsRepository, CommentType} from '../repositories/comments-db-repository'

export const commentsService = {
    async getComment(id:string): Promise<CommentType | null> {
        return await commentsRepository.getComment(id)
    },
    async getCommentsByPostId(postId: string, pageNumber:number, pageSize:number): Promise<Array<CommentType>> {
        return  commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)
    },
    async getCommentsCountByPostId(postId: string): Promise<number> {
       return  commentsRepository.getCommentsCountByPostId(postId)
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    },

}