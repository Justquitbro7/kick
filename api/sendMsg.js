const axios = require('axios');

module.exports = async function(req, res) {
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    
    // We already know your exact ID from the data dump earlier!
    const BROADCASTER_ID = 93973564; 
    const MESSAGE = "🤖 Hello from the official Vercel Engine! The bot is armed.";

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ error: "Missing API Keys." });
    }

    try {
        // 1. GRAB THE OFFICIAL VIP PASS (Access Token)
        const tokenResponse = await axios.post('https://id.kick.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. FIRE THE MESSAGE USING THE CORRECT API ENDPOINT
        const chatResponse = await axios.post('https://api.kick.com/public/v1/chat-messages', {
            broadcaster_user_id: BROADCASTER_ID,
            content: MESSAGE,
            type: 'bot'
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // 3. CONFIRM MISSION SUCCESS
        return res.status(200).json({ 
            status: "MESSAGE DELIVERED",
            message_sent: MESSAGE,
            kick_receipt: chatResponse.data
        });

    } catch (error) {
        const statusCode = error.response ? error.response.status : 'No Status';
        const rawData = error.response ? error.response.data : error.message;

        return res.status(500).json({ 
            status: "DELIVERY FAILED", 
            kick_error_code: statusCode,
            kick_raw_response: rawData
        });
    }
};
