export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { version, token } = req.body;

    const CONFIGS = {
        cpm1: {
            RANK_URL: 'https://us-central1-cp-multiplayer.cloudfunctions.net/SetUserRating4'
        },
        cpm2: {
            RANK_URL: 'https://us-central1-cpm-2-7cea1.cloudfunctions.net/SetUserRating17_AppI'
        }
    };

    const config = CONFIGS[version];
    if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid version' });
    }

    const ratingData = {
        cars: 100000, car_fix: 100000, car_collided: 100000, car_exchange: 100000,
        car_trade: 100000, car_wash: 100000, slicer_cut: 100000, drift_max: 100000,
        drift: 100000, cargo: 100000, delivery: 100000, taxi: 100000, levels: 100000,
        gifts: 100000, fuel: 100000, offroad: 100000, speed_banner: 100000,
        reactions: 100000, police: 100000, run: 100000, real_estate: 100000,
        t_distance: 100000, treasure: 100000, block_post: 100000, push_ups: 100000,
        burnt_tire: 100000, passanger_distance: 100000, time: 10000000000,
        race_win: 3000
    };

    try {
        const rankRes = await fetch(config.RANK_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'okhttp/3.12.13'
            },
            body: JSON.stringify({ 
                data: JSON.stringify({ RatingData: ratingData }) 
            })
        });

        if (rankRes.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'King Rank set successfully' 
            });
        } else {
            const errorData = await rankRes.json();
            return res.status(400).json({ 
                success: false, 
                message: errorData.error || 'Failed to set rank' 
            });
        }
    } catch (error) {
        console.error('Rank set error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}