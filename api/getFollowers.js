const axios = require('axios');

module.exports = async function(req, res) {
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    const USERNAME = 'justquitbro7'; 

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ error: "Missing API Keys." });
    }

    try {
        const tokenResponse = await axios.post('https://id.kick.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        const channelResponse = await axios.get(`https://api.kick.com/public/v1/channels?slug=${USERNAME}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        const channelData = channelResponse.data.data ? channelResponse.data.data[0] : channelResponse.data[0];
        
        if (!channelData) {
            return res.status(404).json({ error: "Channel found, but no data returned." });
        }

        // We are dumping the raw data to see EXACTLY what Kick is giving us
        return res.status(200).json({ 
            status: "SUCCESS",
            username: USERNAME.toUpperCase(),
            raw_kick_data: channelData
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "ERROR", 
            message: "Failed to connect to Kick API." 
        });
    }
};
