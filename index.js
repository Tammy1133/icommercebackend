const express = require("express");
const app = express();

const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
const cors = require("cors");
app.use(cors());
app.use(express.json());
const db = require("./models");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
app.use("/api", productRoute);
app.use("/api", userRoute);

db.sequelize.sync().then(() => {
  app.listen(3005, () => {
    console.log("Server running");
  });
});
