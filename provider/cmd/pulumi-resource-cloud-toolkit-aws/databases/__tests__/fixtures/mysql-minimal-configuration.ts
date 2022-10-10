import * as config from "../../mysqlArgs";

export default {
  instance: "db.t3.small",
  version: config.MysqlVersion.V8_0,
  database: {
    name: "mydb",
    username: "admin",
    password: "myspasword",
  },
  storage: {
    size: 20,
  },
};
