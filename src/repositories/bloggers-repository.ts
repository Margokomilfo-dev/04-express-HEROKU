export type BloggerType = { id: number, name: string, youtubeUrl: string }
let bloggers = [
    {id: 1, name: 'blogger1', youtubeUrl: 'youtube1.com'},
    {id: 2, name: 'blogger2', youtubeUrl: 'youtube2.com'},
    {id: 3, name: 'blogger3', youtubeUrl: 'youtube3.com'}
]

export const bloggersRepository = {
    async findBloggers(searchTerm: string|undefined): Promise<Array<BloggerType>>{
        if (searchTerm) {
            return bloggers.filter(b => b.name.indexOf(searchTerm)> -1 )
        }else {
            return bloggers
        }
    },
    createBlogger(name: string, url: string) {
        const bloggerLength = bloggers.length
        const newBlogger: BloggerType = {
            id: +(new Date()),
            name: name,
            youtubeUrl:url,
        }
        bloggers.push(newBlogger)
        if (bloggerLength < bloggers.length) {
           return newBlogger
        } else {
           return null
        }
    },
    findBloggerById(id: number){
        const blogger = bloggers.find(b => b.id === id)
        if (blogger) {
            return blogger
        } else {
            return null
        }
    },
    updateBlogger(id: number, name: string, url: string){
        const blogger = bloggers.find(b => b.id === id)
        if (blogger) {
            bloggers = bloggers.map(b => {
                if (b.id === id) {
                    return {...b, name: name, youtubeUrl:url}
                } else return b
            })
            return true
        } else return false
    },
    deleteBlogger (id: number) {
        if (id) {
            let newBloggers = bloggers.filter(b => b.id !== id)
            if (newBloggers.length < bloggers.length) {
                bloggers = newBloggers
                return true
            }
        } else return false
    }
}