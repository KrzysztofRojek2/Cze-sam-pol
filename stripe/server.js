const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51PRFfWBdL6k78L4fv673nxtQvU7WGoPER7bVhVGS4txy2I3xg8CrBYIfX5u9XVUm5z4NnzBn2dIh0vltaB0z95XP00CrNmMdEL'); // Zamień na swój klucz tajny

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tworzenie PaymentIntent
app.post('/payment/create-intent', async (req, res) => {
    try {
        // Logowanie żądania
        console.log('Received request:', req.body);

        const { amount, currency = 'usd' } = req.body;

        // Walidacja danych
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            console.log('Invalid amount:', amount);
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Tworzenie PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Kwota w centach
            currency, // Domyślna waluta to USD
        });

        // Logowanie odpowiedzi
        console.log('Created PaymentIntent:', paymentIntent);

        // Odpowiedź z `clientSecret`
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Uruchamianie serwera
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
