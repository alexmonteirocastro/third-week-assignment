'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body-parser')
const articles = require('./articles')

const app = new Koa()
const router = new Router()
const PORT = 3000

app.context.articles = articles

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello and Welcome to the Articles RESTful API!'
    ctx.res.statusCode = 200
    next()
})

router.get('/api/articles', async (ctx, next) => {
    const listOfArticles = []
    ctx.articles.forEach((value, key) => listOfArticles.push({id: key, articleText: value}))
    ctx.set('Content-Type', 'application/json')
    ctx.response.status = 200
    ctx.response.body = listOfArticles
    next()
})
 
router.get('/api/articles/:id', async (ctx, next) => {
    const articleId = Number(ctx.params.id)
    if(!ctx.articles.has(articleId)){
       ctx.throw(404, 'Article not found.')
       next()
    }
    ctx.response.status = 200
    ctx.response.body = {id: articleId, text: ctx.articles.get(articleId)}
    next()
})

router.post('/api/articles', async (ctx, next) => {
    if(!ctx.request.body.text){
        ctx.throw(400, 'Article text is required.')
        next()
    }
    ctx.response.status = 201
    ctx.articles.set(ctx.articles.size, ctx.request.body.text)
    ctx.response.body = {id: ctx.articles.size - 1 , text: ctx.articles.get(ctx.articles.size - 1)}
    next()
})

router.patch('/api/articles/:id', async (ctx, next) => {
    const articleId = Number(ctx.params.id)
    if(!ctx.articles.has(articleId)){
       ctx.throw(404, 'Article not found.')
       next()
    }
    ctx.articles.set(articleId, ctx.request.body.text)
    ctx.response.status = 200
    ctx.response.body = {id: articleId, text: ctx.articles.get(articleId)}
    next()
})

router.delete('/api/articles/:id', async (ctx, next)=> {
    const articleId = Number(ctx.params.id)
    if(!ctx.articles.has(articleId)){
       ctx.throw(404, 'Article not found.')
       next()
    }
    if(ctx.articles.delete(articleId)){
        ctx.response.status = 204
    }
    next()
})

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .on('error', err => console.error('server error', err))
    .listen(PORT, () => console.log('Up and running on port ' + PORT))