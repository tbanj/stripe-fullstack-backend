const logger = require("../utils/logger");
const { stripe } = require("../config/stripe");

/* import type { Stripe } from "stripe";

import { stripe } from "@/utils/stripe-server"; */

exports.SessionResult = async (req, res, next) => {
  try {
    const session_id = req.query.session_id;
    // const session_id = new URL(req.url).searchParams.get("session_id");

    if (!session_id) {
      throw new Error("Please provide a valid session_id (`cs_test_...`)");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      session_id,
      {
        expand: ["line_items", "payment_intent"],
      }
    );
    logger.info(`Stripe Session id fetched`);

    //   return Response.json(checkoutSession);
    res.status(200).json({
      data: { checkoutSession },
      message: "Stripe Session id fetched successfuly",
    });
  } catch (error) {
    logger.error("Error unable to fetch Stripe Session for this id", error);
    next(error);
  }
};
