const crypto = require("crypto");
const config = require("../config");
const jwt = require("jsonwebtoken");

function md5(str) {
  let obj = crypto.createHash("md5");

  obj.update(str);

  return obj.digest('hex');
}

function md5_2(str) {
  return md5(md5(str) + `${config.key}`);
}

function generateToken(data, time) {
  let create = Math.floor(Date.now() / 1000);
  let token = jwt.sign({
    exp: create + time,
    id: data,
  }, config.tKey)
  return token;
}

function verify(token) {
  let data = {}
  try {
    data = jwt.verify(token, config.tKey);
  } catch(err) {
    console.log("token错误");
  }
  return data
}

module.exports = {
  md5_2,
  generateToken,
  verify
};
