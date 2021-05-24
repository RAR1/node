const common = require("./common");

module.exports = server => {
  server.use(async (ctx,next) => {
    let { path } = ctx.request;
    if(path != '/user/login' && path != "/user/register") {
      let { token } = ctx.request.fields;
      if(token) {
        let { exp, id } = common.verify(token);
        if(id) {
          let data = await new Promise((resolve, reject) => {
            ctx.client.get(`token_${id}`, (err, data) =>{
              if(err) {
                reject(err)
              } else {
                resolve(data);
              }
            })
          })
          if(data == "") {
            ctx.body = { error: 2, msg: "暂未登录，请重新登录" }
          }else if(token == data) {
            ctx.user_id = id;
            await next();
          } else {
            ctx.body = {error: 2, msg: '您的账号在其他机器登录，请退出重新登录'};
          }
        } else {
          ctx.body = {error: 2, msg: "您的登录状态已过期"};
        }
      }
    }else {
      await next();
    }
  })
}
