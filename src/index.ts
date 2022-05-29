import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from './routes/bloggers-router'
import {postsRouter} from './routes/posts-router'
import {runDb} from './repositories/db'
import {authRouter} from './routes/auth-router'
import {usersRouter} from './routes/users-router'
import {commentsRouter} from './routes/comments-router'
//create express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 5005

app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!!!!- express (3 homework with MONGO DB)')
})

app.use('/auth', authRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
//start app

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()