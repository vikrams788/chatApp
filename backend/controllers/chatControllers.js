const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = async (req, res) => {
    const { anotherUserId } = req.params;

    if (!anotherUserId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        users: { $all: [req.user.userId, anotherUserId] }
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
        chatName: "sender",
        users: [req.user.userId, anotherUserId],
        };

        try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );
        res.status(200).json(FullChat);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
};

exports.fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user.userId } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
            });
            res.status(200).send(results);
        });
    } catch (error){
        res.status(500).json({message: "Internal server error"});
    }
};