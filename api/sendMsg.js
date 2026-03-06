const axios = require('axios');

module.exports = async function(req, res) {
    // Vercel Vault Keys
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    const USERNAME = 'justquitbro7'; 
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

        // 2. GET YOUR SPECIFIC CHATROOM ID (Just like the Jailex HUD does)
        const userResponse = await axios.get(`https://kick.com/api/v2/channels/${USERNAME}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0' }
        });
        
        const chatroomId = userResponse.data.chatroom.id;

        // 3. FIRE THE MESSAGE INTO YOUR CHATROOM
        const chatResponse = await axios.post(`https://api.kick.com/public/v1/chatrooms/${chatroomId}/messages`, {
            content: MESSAGE
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // 4. CONFIRM MISSION SUCCESS
        return res.status(200).json({ 
            status: "MESSAGE DELIVERED",
            target_chat: USERNAME.toUpperCase(),
            message_sent: MESSAGE
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
