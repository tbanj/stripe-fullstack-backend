const logger = require("../utils/logger");
const { stripe } = require("../config/stripe");

// import { stripe } from "@/utils/stripe-server";

function formatAmountForStripe(amount, currency) {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

exports.inititateOpenPaymentModal = async (req, res, next) => {
  try {
    var fullUrl = req.protocol + "://" + req.get("host");
    const customDonation = req.headers["custom_donation"];
    const amount = customDonation ? Number(customDonation) : 0;
    // const origin = req.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
              description: `Donation of ${amount}`,
            },
            unit_amount: formatAmountForStripe(amount, "usd"),
          },
        },
      ],
      success_url: `${fullUrl}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${fullUrl}/`, // am not creating a url for cancel just for this project
      ui_mode: "hosted",
    });

    logger.info(`Stripe Payment Modal is Initiated`);

    res.status(201).json({
      data: { client_secret: session.client_secret, url: session.url },
      message: "Stripe Payment Modal is Initiated Successfully",
    });
  } catch (error) {
    logger.error("Error unable to Initiate Stripe Payment Modal", error);
    next(error);
  }
};
