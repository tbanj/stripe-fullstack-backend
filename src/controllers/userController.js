const sql = require("../config/database");
const logger = require("../utils/logger");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, clerkId } = req.body;

    if (!name || !email || !clerkId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
      INSERT INTO users (
        name, email, clerk_id
      )
      VALUES (
        ${name},
        ${email},
        ${clerkId}
      )
      RETURNING *;
    `;

    logger.info(`New user created with ID: ${response[0].id}`);
    res
      .status(201)
      .json({ data: response[0], message: "New user created successfully" });
  } catch (error) {
    logger.error("Error creating user:", error);
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, clerkId, primary_phone_number } = req.body;

    if (!name || !email || !clerkId || !primary_phone_number) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
     UPDATE users
SET name = ${name},
    primary_phone_number = ${primary_phone_number},
    email = ${email}
WHERE clerk_id = ${clerkId};
    `;

    logger.info(`Updated user record of clerk_id: ${clerkId}`);
    res
      .status(201)
      .json({ data: response[0], message: "Updated user record successfully" });
  } catch (error) {
    logger.error("Error creating user:", error);
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
     SELECT
      name,
      email
      clerk_id,
      primary_phone_number
     FROM 
      users
     WHERE 
        users.clerk_id = ${id}
      ORDER BY 
        users.id DESC;
    `;

    logger.info(`Found user record of clerk_id: ${id}`);
    res.status(200).json({
      data: response,
      status: 200,
      message: "Retrieved user record successfully",
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    next(error);
  }
};
