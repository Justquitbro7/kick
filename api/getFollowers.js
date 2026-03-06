const axios = require('axios');

module.exports = async function(req, res) {
    const USERNAME = 'justquitbro7'; 

    try {
        // Pinging Kick's public V2 API directly (No secret keys required!)
        const response = await axios.get(`https://api.kick.com/api/v2/channels/${USERNAME}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        // Extracting the exact follower count from the V2 data
        const followers = response.data.followersCount;
        
        return res.status(200).json({ 
            status: "SUCCESS",
            username: USERNAME.toUpperCase(),
            followers: followers 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "ERROR", 
            message: "Failed to connect to Kick V2 API."
        });
    }
};
