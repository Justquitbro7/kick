const axios = require('axios');

module.exports = async function(req, res) {
    // PASTE THE ACCESS TOKEN YOU GOT FROM THE CALLBACK SCREEN HERE
    const USER_TOKEN = "YOUR_NEW_ACCESS_TOKEN_HERE"; 
    const BROADCASTER_ID = 93973564; 

    try {
        const chatResponse = await axios.post('https://api.kick.com/public/v1/chat-messages', {
            broadcaster_user_id: BROADCASTER_ID,
            content: "🤖 JAILEX SYSTEM: Official Chat Authorization Complete.",
            type: 'bot'
        }, {
            headers: {
                'Authorization': `Bearer ${USER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json({ status: "SUCCESS", message: "Message posted officially!" });
    } catch (error) {
        return res.status(500).json({ error: "Post Failed", details: error.response?.data || error.message });
    }
};
