const mongoose = require('mongoose');

const { Schema } = mongoose;

const accountModel = new Schema(
    {
        username: { type: String },
        password: { type: String },
        admin: { type: Boolean },
        history: { type: String },
        token: { type: mongoose.Mixed },
        information: { type: String },
        friends: { type: Array }

    }
)

module.exports = mongoose.model('accountModel', accountModel, "account");