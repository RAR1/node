module.exports = server => {
  server.use(handler);
}

async function handler(ctx, next) {
  try {
    await next()
  } catch(e) {
    console.log(e);
    ctx.body = "服务器正在维护,请稍后重试!"
  }
}
