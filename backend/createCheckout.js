import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  try {
    const { size, theme, colors, description, email, budget } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: {
              name: `Custom Artwork (${size}, ${theme})`,
              description: description,
              metadata: {
                size,
                theme,
                colors: colors.join(", "),
                description,
              },
            },
            unit_amount: Number(budget) * 100 // convert RON to bani
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });

    return res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: "Failed to create checkout session." });
  }
}
