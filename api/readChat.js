const axios = require('axios');

module.exports = async function(req, res) {
    const USERNAME = 'justquitbro7';

    try {
        // 1. First, we get your Chatroom ID (The same way JailexBeta does)
        const userResponse = await axios.get(`https://kick.com/api/v2/channels/${USERNAME}`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
                'Accept': 'application/json'
            }
        });
        
        const chatroomId = userResponse.data.chatroom.id;

        // 2. Now we fetch the latest messages from that chatroom
        const chatResponse = await axios.get(`https://kick.com/api/v2/channels/${chatroomId}/messages`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
                'Accept': 'application/json'
            }
        });

        // 3. We clean up the data so it's easy to read
        const messages = chatResponse.data.data.messages.map(msg => ({
            user: msg.sender.username,
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString()
        }));

        return res.status(200).json({ 
            status: "SUCCESS",
            channel: USERNAME.toUpperCase(),
            latest_messages: messages 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "READ_ERROR", 
            message: "Could not connect to Kick Chat feed.",
            details: error.message 
        });
    }
};
