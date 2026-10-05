const Stripe = require("stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { adId, email } = req.body || {};

    if (!adId) {
      return res.status(400).json({ error: "Missing adId" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const origin = req.headers.origin || process.env.SITE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "UNO — spazio pubblicitario",
              description: "Visibilità per 7 giorni"
            },
            unit_amount: 100
          },
          quantity: 1
        }
      ],

      metadata: {
        ad_id: String(adId)
      },

      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`
    });

    res.status(200).json({ url: session.url });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Checkout error" });
  }
};
