import * as config from "../../mysqlArgs";

export default {
  instance: "db.t3.small",
  version: "5_7",
  database: {
    name: "mydb",
    username: "admin",
    password: "myspasword",
  },
  storage: {
    size: 20,
  },
};
