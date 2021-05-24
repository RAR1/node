const config = require("../config");
const fs = require("fs");

module.exports= server =>{
  server.use(async (ctx, next) => {
    await new Promise((resolve, reject) => {
      fs.appendFile(config.logPath, `[${Date.now()}] ${ctx.method} ${ctx.url}\r\n`, err => {
        resolve()
      })
    })
    await next();
  })
}
