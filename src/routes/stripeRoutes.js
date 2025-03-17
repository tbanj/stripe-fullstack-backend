const express = require("express");
const logger = require("././../utils/logger");
const checkoutSessionController = require("../controllers/hostedCheckoutSession");
const payController = require("../controllers/paymentSheet");
const stripeSessionResultController = require("../controllers/stripeSessionResults");

const router = express.Router();
router.get("/", (req, res) => {
  logger.info(`Root stripe fullstack is called`);

  res.status(201).json({
    data: "Welcome to Stripe Homepage",
    message: "Root stripe fullstack is called Successfully",
  });
});
router.post(
  "/hosted-checkout-session",
  checkoutSessionController.inititateOpenPaymentModal
);
router.post("/payment-sheet", payController.Pay);
router.post("/stripe-results", stripeSessionResultController.SessionResult);
module.exports = router;
