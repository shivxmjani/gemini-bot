const cors = require('cors');


const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;
const apiKey = 'Your Secret Key';

const genAI = new GoogleGenerativeAI(apiKey);
app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(message);
        console.log(result)
        res.json({ response: { text: result.response.text() } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
