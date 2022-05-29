import {comments} from './db'
import {ObjectId, WithId} from 'mongodb'
import {UserType} from './users-db-repository'

export type CommentType =WithId<{
    id: string,
    content: string
    userId: string
    userLogin: string
    addedAt: string
    postId: string
}>

export const commentsRepository = {
    async getComment(id: string): Promise<CommentType | null> {
        return comments.findOne({id}, {projection:{_id:0, postId: 0}})
    },
    async getCommentsByPostId(postId: string,pageNumber:number, pageSize:number): Promise<Array<CommentType>> {
        return comments.find({postId}, {projection:{_id:0, postId: 0}}).skip(pageSize*(pageNumber-1)).limit(pageSize).toArray()
    },
    async getCommentsCountByPostId(postId: string): Promise<number> {
        return comments.countDocuments({postId})
    },
    async createComment(content: string, user: UserType, postId: string): Promise<CommentType> {
        console.log(user)
        const comment = {
            _id: new ObjectId(),
            id: new Date().getTime().toString(),
            content,
            userId: user.id,
            userLogin: user.login,
            addedAt: new Date().toISOString(),
            postId
        }

        await comments.insertOne(comment, {forceServerObjectId:true})
        return comment
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        const isUpdated = await comments.findOneAndUpdate({id}, {$set: {content}},
            {upsert: true}
        )
        return isUpdated.value !== null
    },

    async deleteComment(id: string): Promise<boolean> {
        const isDeleted = await comments.findOneAndDelete({id})
        return isDeleted.value !== null
    },

}