const axios = require('axios');

module.exports = async function(req, res) {
    const USERNAME = 'justquitbro7'; 

    try {
        // CORRECTED URL: Removed the extra "api." at the beginning
        const response = await axios.get(`https://kick.com/api/v2/channels/${USERNAME}`, {
            headers: {
                'Accept': 'application/json',
                // Disguising the bot as a real Google Chrome browser to bypass security
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        // Extracting the exact follower count
        const followers = response.data.followersCount;
        
        return res.status(200).json({ 
            status: "SUCCESS",
            username: USERNAME.toUpperCase(),
            followers: followers 
        });

    } catch (error) {
        // The Diagnostic Scanner
        const statusCode = error.response ? error.response.status : 'No Status';
        const rawData = error.response ? error.response.data : error.message;

        return res.status(500).json({ 
            status: "ERROR", 
            message: "Failed to connect to Kick V2 API.",
            kick_error_code: statusCode,
            kick_raw_response: rawData
        });
    }
};
