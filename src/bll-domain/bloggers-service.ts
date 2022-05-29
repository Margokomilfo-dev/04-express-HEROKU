import {bloggersRepository} from '../repositories/bloggers-db-repository'
import {BloggerType} from '../repositories/bloggers-repository'

export const bloggersService = {
    async findBloggers(pageNumber:number, pageSize:number,SearchNameTerm: string | undefined) {
        const foundBloggers = await bloggersRepository.findBloggers(pageNumber,pageSize,SearchNameTerm)
        const allBloggersCount = await bloggersRepository.getAllBloggersCount(SearchNameTerm)
        return {
            pagesCount: Math.ceil(allBloggersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allBloggersCount,
            items: foundBloggers
        }
    },

    async createBlogger(name: string, url: string): Promise<BloggerType | null> {
        const newBlogger: BloggerType = {
            id: +(new Date()),
            name: name,
            youtubeUrl: url,
        }
        return  bloggersRepository.createBlogger(newBlogger)
    },

    async findBloggerById(id: number):Promise<BloggerType | null> {
      return bloggersRepository.findBloggerById(id)
    },

    async updateBlogger(id: number, name: string, url: string): Promise<boolean> {
        const isBlogger = await bloggersRepository.findBloggerById(id)
        if(!isBlogger){
            return false
        }
        return bloggersRepository.updateBlogger(id, name,url)
    },

    async deleteBlogger(id: number) {
        return bloggersRepository.deleteBlogger(id)
    }

}