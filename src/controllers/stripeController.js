const sql = require("../config/database");
const stripe = require("../config/stripe");
const logger = require("../utils/logger");

exports.createCustomerStripeRecord = async (req, res, next) => {
  try {
    const { name, email, amount, paymentMethodId } = req.body;
    if (!name || !email || !amount || !paymentMethodId) {
      return res.status(400).json({
        error: "Please enter a valid name, email address and amount",
        status: 400,
      });
    }

    let customer;
    const existingCustomer = await stripe.customers.list({ email });

    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      const newCustomer = await stripe.customers.create({ name, email });
      customer = newCustomer;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: "usd",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    logger.info(
      `New customer record on stripe created with ID: ${customer.id}`
    );

    res.status(201).json({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
      message: "New customer record on stripe created ",
    });
  } catch (error) {
    logger.error("Error when creating a customer record on stripe:", error);
    next(error);
  }
};

exports.createPaymentWithStripe = async (req, res, next) => {
  try {
    const { payment_method_id, payment_intent_id, customer_id } = req.body;
    if (!payment_method_id || !payment_intent_id || !customer_id)
      return res.status(400).json({
        error: "Miss required payment information",
        status: 400,
      });

    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer: customer_id,
      }
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    logger.info(`Payment confirmed successfully for user ID: ${customer_id}`);

    res.status(201).json({
      success: true,
      message: "Payment confirmed successfully",
      result,
    });
  } catch (error) {
    logger.error("Error Payment was unable to be confirmed:", error);
    next(error);
  }
};
