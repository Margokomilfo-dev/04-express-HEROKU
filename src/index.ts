import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from './routes/bloggers-router'
import {postsRouter} from './routes/posts-router'
import {runDb} from './repositories/db'
//create express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 5005

app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!!!!- express (3 homework with MONGO DB)')
})

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
//start app

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()