import {postRepository} from '../repositories/posts-db-repository'
import {PostType} from '../repositories/posts-repository'
import {bloggersRepository} from '../repositories/bloggers-db-repository'

export const postService = {
    async getPosts(pageNumber:number, pageSize:number) {
        const foundPosts = await postRepository.getPosts(pageNumber, pageSize)
        const allPostsCount = await postRepository.getAllPostsCount()
        return {
            pagesCount: Math.ceil(allPostsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allPostsCount,
            items: foundPosts
        }
    },
    async getPostsByBloggerId(pageNumber:number, pageSize:number,bloggerId: number): Promise<any> {
        const allPostsByBloggerId= await postRepository.getAllPostsByBloggerId(bloggerId)
        const foundPosts = await postRepository.getPostsByBloggerId(pageNumber, pageSize,bloggerId)
        return {
            pagesCount: Math.ceil(allPostsByBloggerId.length / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allPostsByBloggerId.length,
            items: foundPosts
        }

    },
    async getAllPostsByBloggerId(bloggerId: number): Promise<PostType[]> {
        return await postRepository.getAllPostsByBloggerId(bloggerId)
    },
    async createPost(title: string, descr: string, content: string, bloggerId: number) {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        const newPost: PostType = {
            id: +(new Date()),
            title,
            shortDescription: descr,
            content,
            bloggerId,
            bloggerName: blogger?.name
        }
        return await postRepository.createPost(newPost)
    },
    async getPostById(id: number) {
        return await postRepository.getPostById(id)
    },

    async updatePost(id: number, title: string, descr: string, content: string, bloggerId: number,bloggerName: string) {
        const post = await postRepository.getPostById(id)
        if (!post) {
            return false
        }
       return await postRepository.updatePost(id, title,descr,content,bloggerId, bloggerName)
    },

    async deletePost(id: number) {
        const res = await postRepository.deletePost(id)
        // console.log(res.value) //null or object
        // console.log(res.ok) // always 1
        return res.value !== null
    }
}