const axios = require('axios');

module.exports = async function(req, res) {
    const { code } = req.query; 

    if (!code) {
        return res.status(400).send("No authorization code received. Try logging in again.");
    }

    try {
        // This swaps the temporary code for a REAL USER TOKEN
        const response = await axios.post('https://id.kick.com/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.KICK_CLIENT_ID,
            client_secret: process.env.KICK_CLIENT_SECRET,
            redirect_uri: 'https://kick-jade-nu.vercel.app/api/callback'
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // This is your golden ticket
        const userToken = response.data.access_token;

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
            <body style="background:#060e1a; color:#53FC18; font-family:sans-serif; text-align:center; padding-top:100px;">
                <h1 style="font-family:'Orbitron';">CONNECTION SECURE</h1>
                <p style="color:white;">Jeremy, you have officially authorized Jailex.</p>
                <div style="background:#000; padding:20px; border:1px solid #53FC18; display:inline-block; color:#00d2ff; font-family:monospace;">
                    TOKEN SECURED: ${userToken.substring(0, 15)}...
                </div>
                <p style="color:#aaa; font-size:12px; margin-top:20px;">You can now close this window.</p>
            </body>
        `);

    } catch (error) {
        return res.status(500).json({ error: "Handshake Failed", details: error.response?.data || error.message });
    }
};
