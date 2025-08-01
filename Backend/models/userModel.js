import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // profilePicture: { type: String }, // URL or path to the profile picture
    // role: { type: String, enum: ['admin', 'artist', 'viewer'], default: 'viewer' },
    // bio: { type: String },
    dateJoined: { type: Date, default: Date.now },
    otp: { type:String },
    otpExpires: { type: Date },
    // lastLogin: { type: Date },
    // favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }], // Assuming there's an Artwork schema
    // settings: {
    //     theme: { type: String, default: 'light' },
    //     notifications: { type: Boolean, default: true }
    // }
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
