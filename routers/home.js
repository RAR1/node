const Router = require("koa-router");

let router = new Router();


router.post("/imgList", async ctx => {
  let data = await ctx.db.execute(`SELECT * FROM home_img`);
  console.log(ctx.user_id);
  ctx.body = {error: 0, data};
})

module.exports = router.routes();
