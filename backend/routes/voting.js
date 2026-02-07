import express from 'express'
import { connectDB } from '../config/connectDB.js'
import { Voting } from '../models/VotingModel.js'
import { redisConnect } from '../config/redisConnect.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/api/get-voting-list', async (req, res) => {
    await connectDB();

    try {

        const cached = await redisConnect.get('allVoting');

        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Voting list fetched from redis",
                data: JSON.parse(cached)
            });
        }

        const found = await Voting.find();
        await redisConnect.set('allVoting', JSON.stringify(found));

        return res.status(200).json({
            success: true,
            message: "Voting list fetched from db",
            data: found
        });

    } catch (err) {
        console.log(`Error -> `, err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

router.put('/api/cast-vote', authenticate, async (req, res) => {
    await connectDB();

    const { campaignID, answer } = req.body;
    const userData = req.userData;

    try {
        const found = await Voting.findOneAndUpdate({
            _id: campaignID,
            "options.text": answer
        }, {
            $push: { voterEmail: userData.email },
            $inc: { totalVotes: 1, "options.$.votes": 1 }
        }, {
            new: true
        });

        if (!found) {
            return res.status(404).json({
                success: false,
                message: "Can't vote for this campaign"
            });
        }

        const found = await Voting.find();
        await redisConnect.set('allVoting', JSON.stringify(found));

        return res.status(200).json({
            success: true,
            message: "Voting successfull",
            data: found
        });

    } catch (err) {
        console.log(`Error -> `, err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});


export default router;
