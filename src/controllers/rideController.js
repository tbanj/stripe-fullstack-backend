const sql = require("../config/database");
const logger = require("../utils/logger");

exports.createRide = async (req, res, next) => {
  try {
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = req.body;

    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
      INSERT INTO rides ( 
        origin_address, 
        destination_address, 
        origin_latitude, 
        origin_longitude, 
        destination_latitude, 
        destination_longitude, 
        ride_time, 
        fare_price, 
        payment_status, 
        driver_id, 
        user_id
      ) VALUES (
        ${origin_address},
        ${destination_address},
        ${origin_latitude},
        ${origin_longitude},
        ${destination_latitude},
        ${destination_longitude},
        ${ride_time},
        ${fare_price},
        ${payment_status},
        ${driver_id},
        ${user_id}
      )
      RETURNING *;
    `;

    logger.info(`New ride created with ID: ${response[0].ride_id}`);
    res
      .status(201)
      .json({ data: response[0], message: "New ride created successfully" });
  } catch (error) {
    logger.error("Error inserting data into rides:", error);
    next(error);
  }
};

exports.getRidesByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
      SELECT
        rides.ride_id,
        rides.origin_address,
        rides.destination_address,
        rides.origin_latitude,
        rides.origin_longitude,
        rides.destination_latitude,
        rides.destination_longitude,
        rides.ride_time,
        rides.fare_price,
        rides.payment_status,
        rides.created_at,
        'driver', json_build_object(
          'driver_id', drivers.id,
          'first_name', drivers.first_name,
          'last_name', drivers.last_name,
          'profile_image_url', drivers.profile_image_url,
          'car_image_url', drivers.car_image_url,
          'car_seats', drivers.car_seats,
          'rating', drivers.rating
        ) AS driver 
      FROM 
        rides
      INNER JOIN
        drivers ON rides.driver_id = drivers.id
      WHERE 
        rides.user_id = ${id}
      ORDER BY 
        rides.created_at DESC;
    `;

    logger.info(`Fetched rides for user ID: ${id}`);
    res.json({
      data: response,
      status: 200,
      message: "User rides fetched successfully",
    });
  } catch (error) {
    logger.error("Error fetching rides:", error);
    next(error);
  }
};
