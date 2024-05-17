import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    title: String,
    description: String,
    time: String,
    date: String,
    seen: {type: Boolean, default: false},
    link: String,
    type: {type: String, default: 'success'},
})


const usersSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    token: String,
    role: String,
    bio: String,
    phoneNumber: String,
    profilePicBuffer: String,
    joinedAt: String,
    purchasedCourses:[
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'courses'
            },
            progress: Number,
            date: String,
            purchasedPrice: String,
            lessonsProgress: [
                {
                    _id: mongoose.Schema.Types.ObjectId,
                    done: Boolean
                }
            ],
        }
    ],
    notifications: [
        notificationSchema
    ],
    update_courses_notifications: Boolean,
    enable_offers_notifications: Boolean
})

const User = mongoose.models.users || mongoose.model('users', usersSchema)
export default User;