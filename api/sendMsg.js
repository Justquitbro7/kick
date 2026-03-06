const axios = require('axios');

module.exports = async function(req, res) {
    // This uses the Token you just got from the handshake
    const AUTH_TOKEN = "PASTE_THE_TOKEN_YOU_GOT_FROM_THE_SCREEN_HERE"; 
    const BROADCASTER_ID = 93973564; 

    try {
        const chatResponse = await axios.post('https://api.kick.com/public/v1/chat-messages', {
            broadcaster_user_id: BROADCASTER_ID,
            content: "🤖 JAILEX SYSTEM: Online and Authorized.",
            type: 'bot'
        }, {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json({ status: "SUCCESS", message: "Bot has spoken!" });
    } catch (error) {
        return res.status(500).json({ error: "Post Failed", details: error.response?.data || error.message });
    }
};
