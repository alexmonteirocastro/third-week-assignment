'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const pino = require('pino');
const logger = pino({ prettyPrint: true });
  
const bodyParser = require('koa-body-parser');
const articles = require('./articles');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.context.articles = articles;

router.get('/', async (ctx, next) => {
	logger.info(ctx.request.method, ctx.request.url);
	ctx.body = 'Hello and Welcome to the Articles RESTful API!';
	ctx.res.statusCode = 200;
});

router.get('/api/articles', async (ctx, next) => {
	logger.info(ctx.request.method, ctx.request.url);
	const listOfArticles = [];
	ctx.articles.forEach((value, key) => listOfArticles.push({id: key, articleText: value}));
	ctx.response.status = 200;
	ctx.response.body = listOfArticles;
});
 
router.get('/api/articles/:id', async (ctx, next) => {
	logger.info(ctx.request.method, ctx.request.url);
	const articleId = Number(ctx.params.id);
	if(!ctx.articles.has(articleId)){
		ctx.throw(404, 'Article not found.');
	}
	ctx.response.status = 200;
	ctx.response.body = {id: articleId, text: ctx.articles.get(articleId)};
});

router.post('/api/articles', async (ctx, next) => {
	logger.info(ctx.request.method, ctx.request.url);
	if(!ctx.request.body.text){
		ctx.throw(400, 'Article text is required.');
	}
	ctx.response.status = 201;
	ctx.articles.set(ctx.articles.size, ctx.request.body.text);
	ctx.response.body = {id: ctx.articles.size - 1 , text: ctx.articles.get(ctx.articles.size - 1)};
});

router.patch('/api/articles/:id', async (ctx, next) => {
	logger.info(ctx.request.method, ctx.request.url);
	const articleId = Number(ctx.params.id);
	if(!ctx.articles.has(articleId)){
		ctx.throw(404, 'Article not found.');
	}
	ctx.articles.set(articleId, ctx.request.body.text);
	ctx.response.status = 200;
	ctx.response.body = {id: articleId, text: ctx.articles.get(articleId)};
});

router.delete('/api/articles/:id', async (ctx, next)=> {
	logger.info(ctx.request.method, ctx.request.url);
	const articleId = Number(ctx.params.id);
	if(!ctx.articles.has(articleId)){
		ctx.throw(404, 'Article not found.');
	}
	if(ctx.articles.delete(articleId)){
		ctx.response.status = 204;
	}
});

app
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())
	.on('error', err => logger.info('server error', err))
	.listen(PORT, () => logger.info('Up and running on port ' + PORT));