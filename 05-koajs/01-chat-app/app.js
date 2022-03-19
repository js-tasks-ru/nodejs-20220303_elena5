const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const resolvers = [];

router.get('/subscribe', async (ctx, next) => {
  const text = await new Promise((resolve) => {
    resolvers.push(resolve);
  });
  ctx.body = text;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.body = 'The message was ignored';
    return;
  }

  while (resolvers.length) {
    resolvers.pop()(message);
  }
  ctx.body = 'The message was published';
});

app.use(router.routes());

module.exports = app;
