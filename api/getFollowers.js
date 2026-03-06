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

        // 2. Fetch your specific channel data
        const channelResponse = await axios.get(`https://api.kick.com/public/v1/channels/${USERNAME}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        // 3. Extract the followers and display them
        const followers = channelResponse.data.followers_count;
        
        return res.status(200).json({ 
            status: "SUCCESS",
            username: USERNAME.toUpperCase(),
            followers: followers 
        });

    } catch (error) {
        // DIAGNOSTIC SCANNER: Capturing exactly what Kick rejected
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
