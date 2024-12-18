// schemas/index.js

import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://gudrms1217:rms3294@cluster0.ohzuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "itemSimulator_memo"
      }
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

const userConnect = () => {
  mongoose
    .connect(
      "mongodb+srv://gudrms1217:rms3294@cluster0.ohzuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "characterSimulator_memo"
      }
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export { connect, userConnect };
