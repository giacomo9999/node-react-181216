const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbRoute = "mongodb://j_gary_181216:banana_candle8@ds237574.mlab.com:37574/node-react-181216";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => console.log("Connected to the database"));

// check if database connection is successful
db.on("error", console.error.bind(console, "MongoDB connection error."));

// for logging and bodyParser - parse req.body to readable JSON format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// GET method - fetch all available data in database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// UPDATE method - overwrites existing data in database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// DELETE method - removes existing data from database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// CREATE method - adds new data to database
router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "Invalid inputs"
    });
  }

  data.message = message;
  data.id = id;
  data.save(err => {
    if (err)
      return res.json({
        success: false,
        error: err
      });
    return res.json({ success: true });
  });
});

//append /api for http requests
app.use("/api", router);

//launch backend into a port
app.listen(API_PORT, () => console.log(`Listening on Port ${API_PORT}`));
