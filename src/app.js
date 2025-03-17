const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const bodyParser = require("body-parser");
const stripeRoutes = require("./routes/stripeRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// app.use(bodyParser.json());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(cors());

app.use(`/api`, stripeRoutes);

app.use(errorHandler);

module.exports = app;
