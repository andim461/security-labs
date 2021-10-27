const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            default: ''
        },
        isActivated: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isPasswordRestricted: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);
const User = mongoose.model("User", userSchema);

module.exports = User;
