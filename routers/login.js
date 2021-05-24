const Router = require("koa-router");
const { md5_2, generateToken } = require("../libs/common");


let router = new Router();

router.post("/login", async ctx => {
  let { account, password } = ctx.request.fields;
  if (account == '') {
    ctx.body = { error: 1, msg: '请输入账号' };
  } else if(password == '') {
    ctx.body = { error: 1, msg: '请输入密码' };
  } else if(!/^\d{6,}$/.test(account)) {
    ctx.body = { error: 1, msg: "账号格式不正确" };
  } else if(!/^\w{6,}$/.test(password)) {
    ctx.body = { error: 1, msg: "密码格式不正确" };
  } else {
    let data = await ctx.db.execute(`SELECT * FROM user_login WHERE account = '${account}'`);
    data = JSON.parse(JSON.stringify(data));
    if(data.length == 0) {
      ctx.body = { error: 1, msg: '没有此用户' };
    } else if(data[0].password != md5_2(password)) {
      ctx.body = { error: 1, msg: '密码输入错误' };
    } else {
      let token = generateToken(data[0].id, 3600);
      ctx.client.set(`token_${data[0].id}`, token);
      ctx.body = { error: 0, msg: '登录成功', data: {token, user_info: data[0]}};
    }
  }
});

router.post("/register", async ctx => {
  let { account, password, nickname } = ctx.request.fields;
  if(!account) {
    ctx.body = { error: 1, msg: '账号不可为空' };
  }else if (!password) {
    ctx.body = { error: 1, msg: '密码不可为空' };
  }else if(!nickname) {
    ctx.body = { error: 1, msg: "昵称不可为空" };
  } else if(!/^\d{6,}$/.test(account)) {
    ctx.body = { error: 1, msg: "账号格式不正确" };
  } else if(!/^\w{6,}$/.test(password)) {
    ctx.body = { error: 1, msg: "密码格式不正确" };
  } else {
    let data = await ctx.db.execute(`SELECT * FROM user_login WHERE account = '${account}'`);
    data = JSON.parse(JSON.stringify(data));
    if(data.length > 0) {
      ctx.body = { error: 1, msg: "该用户已存在" };
    } else {
      await ctx.db.execute(`INSERT INTO user_login (account, password, nickname) VALUES ('${account}', '${md5_2(password)}', '${nickname}')`);
      ctx.body = { error: 0, msg: '注册成功'};
    }
  }
})

router.post("/logout", async ctx => {
  ctx.client.set(`token_${ctx.user_id}`, "");
  ctx.body = { error: 0, msg: '登出成功'};
})

module.exports = router.routes();
