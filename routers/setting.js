const Router = require("koa-router");
const { md5_2 } = require("../libs/common");

let router = new Router();

router.post('/changePassword', async ctx => {
  let { oldPassword, newPassword } = ctx.request.fields;
  if(!oldPassword) {
    ctx.body = { error: 1, msg: '当前登录密码不可为空' };
  }else if(!newPassword) {
    ctx.body = { error: 1, msg: '新密码不可为空' };
  }else if(oldPassword == newPassword) {
    ctx.body = {error: 1, msg: "新旧密码不可一样"};
  }else if(!/^\w{6,}$/.test(newPassword)){
    ctx.body = {error: 1, msg: '密码格式不正确'};
  }else {
    let data = await ctx.db.execute(`SELECT password FROM user_login WHERE id=${ctx.user_id}`);
    data = JSON.parse(JSON.stringify(data))
    if(data[0].password != md5_2(oldPassword)) {
      ctx.body = { error: 1, msg: '当前登录密码不正确' }
    } else {
      await ctx.db.execute(`UPDATE user_login SET password='${md5_2(newPassword)}' WHERE id=${ctx.user_id}`);
      ctx.body = { error: 0, msg: '密码修改成功' }
    }
  }
})

module.exports = router.routes();
