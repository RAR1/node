const pathLib = require("path");

module.exports={
  port: '8888',

  uploadDir: pathLib.resolve("www/upload"),
  wwwDir: pathLib.resolve("www"),
  logPath: pathLib.resolve("log/access.log"),

  db_host: 'localhost',
  db_port: '3306',
  db_user: 'root',
  db_password: '123456',
  db_name: 'work',

  /*md5加密的key*/
  key: 'jflwkeflsalkfdj',
  /*token加密的key*/
  tKey: 'fjasdkljflkdfjwief',
}
