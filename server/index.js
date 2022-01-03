require("dotenv").config()

const express = require("express");

const cors = require('cors')

const app = express();

const router = require("./src/routes");

const port = 5000;

app.use(express.json());
app.use(cors())

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"))

// app.use(function (err, req, res, next) {
//   console.log('This is the invalid field ->', err.field)
//   next(err)
// })

app.listen(port, () => console.log(`Listening on port ${port}!`));