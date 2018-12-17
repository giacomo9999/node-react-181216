const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
// const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

//append /api for http requests
app.use("/api", router);

//launch backend into a port
app.listen(API_PORT, () => console.log(`Listening on Port ${API_PORT}`));
