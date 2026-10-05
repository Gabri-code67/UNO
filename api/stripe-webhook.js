const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const rawBody = Buffer.concat(chunks);

    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const adId = session.metadata?.ad_id;

      if (adId) {
        const now = new Date();
        const expires = new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000
        );

        await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/ads?id=eq.${encodeURIComponent(adId)}`,
          {
            method: "PATCH",
            headers: {
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal"
            },
            body: JSON.stringify({
              status: "active",
              paid_at: now.toISOString(),
              expires_at: expires.toISOString(),
              stripe_session_id: session.id
            })
          }
        );
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Webhook error"
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: false
  }
};
