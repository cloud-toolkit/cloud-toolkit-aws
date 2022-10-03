import * as config from "../../mysqlArgs";

export default {
  instance: "db.t3.small",
  version: "5_7",
  database: {
    name: "mydatabase",
    username: "admin",
    password: "myspasword",
  },
  storage: {
    size: 120,
    type: config.MysqlStorageTypeArgs.io1,
  },
  backup: {
    preferredWindow: "04:00-05:00",
    retentionDays: 5,
  },
  networking: {
    vpc: "vpc-01",
    subnetIds: ["subnet-1", "subnet-2"],
    allowedCidr: ["0.0.0.0/0"],
  },
};
