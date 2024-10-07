"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        // required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        // required: true,
        // unique: true
    },
    Address: {
        type: String,
        // required: true,
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
userSchema.pre("save", async function (next) {
    let user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt_1.default.genSalt(config_1.default.get("saltWorkFactor"));
    const hash = await bcrypt_1.default.hashSync(user.password, salt);
    user.password = hash;
    return next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt_1.default.compare(candidatePassword, user.password).catch((e) => false);
};
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
