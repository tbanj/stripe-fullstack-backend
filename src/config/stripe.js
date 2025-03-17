require("dotenv").config();
/* const { Stripe } = require("stripe");


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
 */

// import Stripe from "stripe";
const Stripe = require("stripe");

exports.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  // https://github.com/stripe/stripe-node#configuration
  appInfo: {
    name: "Stripe Fullstack App",
    version: "1.0.0",
  },
});
