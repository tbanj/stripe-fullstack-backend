const logger = require("../utils/logger");
const { stripe } = require("../config/stripe");

exports.Pay = async (req, res, next) => {
  try {
    const { amount } = await req.body;
    const customer = await stripe.customers.create();
    const ephemeraKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-11-20.acacia" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount ? parseInt(amount) * 100 : 1000,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    /* return Response.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeraKey: ephemeraKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  }); */
    logger.info(`Stripe Payment Modal is Opened`);

    res.status(201).json({
      data: {
        paymentIntent: paymentIntent.client_secret,
        ephemeraKey: ephemeraKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
      message: "Stripe Payment Modal is Opened",
    });
  } catch (error) {
    logger.error("Error unable to Open Stripe Payment Modal", error);
    next(error);
  }
};
