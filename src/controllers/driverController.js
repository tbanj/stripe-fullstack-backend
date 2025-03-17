const sql = require("../config/database");
// const { neon } = require("@neondatabase/serverless");
const logger = require("../utils/logger");

exports.getDrivers = async (req, res, next) => {
  try {
    // const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;

    logger.info(`Get list of drivers`);
    res.status(201).json({ data: response, message: "Drivers list retrieved" });
  } catch (error) {
    logger.error("Error unable to retrieve list of drivers:", error);
    next(error);
  }
};
