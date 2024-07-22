const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the parties.json file
app.get('/parties', (req, res) => {
    res.sendFile(path.join(__dirname, 'parties.json'));
});

app.post('/submit_order', (req, res) => {
    const order = req.body;

    // Read existing orders
    fs.readFile('orders.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        const orders = data ? JSON.parse(data) : [];

        // Add new order
        orders.push(order);

        // Save updated orders
        fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server Error');
            }

            res.send('Order submitted successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
