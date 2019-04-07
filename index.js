const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
const PORT = 3000

router.get('/', async (ctx, next) => {
    ctx.body = 'AHoj'
    next()
})

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT, () => console.log('Up and running on port ' + PORT))