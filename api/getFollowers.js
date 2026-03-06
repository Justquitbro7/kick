const axios = require('axios');

module.exports = async function(req, res) {
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    const USERNAME = 'justquitbro7'; 

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ error: "Missing API Keys in Vercel. Check your Environment Variables." });
    }

    try {
        // 1. Get the official access token
        const tokenResponse = await axios.post('https://id.kick.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. Fetch your channel data using the CORRECT official endpoint path
        const channelResponse = await axios.get(`https://api.kick.com/public/v1/channels?slug=${USERNAME}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        // 3. Kick returns an array of channels, so we grab the first one [0]
        // If they use Twitch's exact format, it's inside a .data array
        const channelData = channelResponse.data.data ? channelResponse.data.data[0] : channelResponse.data[0];
        
        if (!channelData) {
            return res.status(404).json({ error: "Channel found, but no data returned." });
        }

        const followers = channelData.followers_count || channelData.followers || "Count hidden";
        
        return res.status(200).json({ 
            status: "SUCCESS",
            username: USERNAME.toUpperCase(),
            followers: followers 
        });

    } catch (error) {
        const statusCode = error.response ? error.response.status : 'No Status';
        const rawData = error.response ? error.response.data : error.message;

        return res.status(500).json({ 
            status: "ERROR", 
            message: "Failed to connect to Kick API.",
            kick_error_code: statusCode,
            kick_raw_response: rawData
        });
    }
};
