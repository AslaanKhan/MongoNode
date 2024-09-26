import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    Address: string;
    number: string;
    password: string;
    isAdmin: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
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
},{
        timestamps: true
})

userSchema.pre("save", async function (next) {
    let user = this as UserDocument;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
):Promise<boolean>{
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch(
        (e) => false
    );
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel