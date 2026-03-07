const axios = require('axios');

module.exports = async function(req, res) {
    const USERNAME = 'justquitbro7';

    try {
        // 1. We go directly to the channel's message endpoint using the USERNAME
        // This is the most stable public route in 2026
        const response = await axios.get(`https://kick.com/api/v2/channels/${USERNAME}/messages`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
                'Accept': 'application/json'
            }
        });

        // 2. Kick wraps messages in a "data" object. 
        // If the chat is empty, we'll send a fake "System" message so you know it's working.
        let messages = [];
        
        if (response.data && response.data.data && response.data.data.messages) {
            messages = response.data.data.messages.map(msg => ({
                user: msg.sender.username,
                text: msg.content,
                time: new Date(msg.created_at).toLocaleTimeString()
            }));
        }

        // 3. If the list is still empty, let's create a test message
        if (messages.length === 0) {
            messages.push({
                user: "JAILEX_SYSTEM",
                text: "Waiting for live activity... Type in your Kick chat to test!",
                time: new Date().toLocaleTimeString()
            });
        }

        return res.status(200).json({ 
            status: "SUCCESS",
            channel: USERNAME.toUpperCase(),
            latest_messages: messages 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "READ_ERROR", 
            details: error.response?.data || error.message 
        });
    }
};
