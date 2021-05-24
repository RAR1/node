const Koa = require("koa");
const Router = require("koa-router");
const betterBody = require("koa-better-body");
const convert = require("koa-convert");
const staticCache = require("koa-static-cache");
const session = require("koa-session");
const config = require("./config");
const db = require("./libs/db");
const error = require("./libs/error_handler");
const logLib = require("./libs/log");
const redis = require("redis");
const tokenVerify = require("./libs/redis");

let client = redis.createClient(6379, '127.0.0.1');


let server = new Koa();
server.listen(config.port);

error(server);
logLib(server);

server.use(async (ctx, next)=>{
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
})


server.use(async (ctx, next) => {
  ctx.db = db;
  ctx.client = client;
  await next();
})


/*处理post数据*/
server.use(convert(betterBody({
  uploadDir: config.uploadDir
})))

tokenVerify(server);

let mainRouter = new Router();

mainRouter.use('/', require('./routers/index'));
mainRouter.use('/user', require('./routers/login'));
mainRouter.use('/home', require('./routers/home'));
mainRouter.use('/set', require('./routers/setting'));

server.use(mainRouter.routes());

server.use(staticCache(config.wwwDir));
