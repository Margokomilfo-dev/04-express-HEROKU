import {posts} from './db'
import {PostType} from './posts-repository'

export const postRepository = {
    async getPosts(pageNumber:number, pageSize:number,) {
        return posts.find({}, {projection:{_id:0}}).skip(pageSize*(pageNumber-1)).limit(pageSize).toArray()
    },
    async getAllPostsCount(): Promise<number> {
        return posts.countDocuments()
    },
    async getPostsByBloggerId(pageNumber:number, pageSize:number,bloggerId: string): Promise<any> {
        return posts.find({bloggerId}, {projection:{_id:0}}).skip(pageSize*(pageNumber-1)).limit(pageSize).toArray()
    },
    async getAllPostsByBloggerId(bloggerId: string): Promise<PostType[]> {
        return posts.find({bloggerId}, {projection:{_id:0}}).toArray()
    },
    async createPost(newPost: PostType) {
        const created = await posts.insertOne(newPost,{forceServerObjectId:true})
        if (created) {
            return newPost
        } else return null
    },
    async getPostById(id: string) {
        const post = await posts.findOne({id}, {projection:{_id:0}})
        if (post) {
            return post
        } else return null
    },

    async updatePost(id: string, title: string, descr: string, content: string, bloggerId: string, bloggerName: string) {
        await posts.findOneAndUpdate(
            {id},
            {$set: {title, shortDescription: descr, content, bloggerId, bloggerName}},
            {upsert: true}
        )
        return true
    },
    async updatePosts(bloggerId: string, bloggerName: string) {
        await posts.updateMany(
            {bloggerId},
            {$set: {bloggerName}},
            {upsert: true}
        )
        return true
    },

    async deletePost(id: string) {
       return posts.findOneAndDelete({id})
    },
    async deletePosts(bloggerId: string) {
        await posts.deleteMany({bloggerId})
    }
}