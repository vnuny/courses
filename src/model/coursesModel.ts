import mongoose, { Collection } from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: String,
    desc: String,
    lessonIndex: Number,
    links: [
        {
            linkTitle: String,
            link: String
        }
    ],
    videoUrl: String
})

const courseSchema = new mongoose.Schema({
    title: String,
    generalDesc: String,
    img: String,
    rating: Number,
    price: String,
    date: String,
    orderedCount: Number,
    courseAdvantages: [String],
    Collisions: [
        {
            collisionsTitle: String,
            collisionGeneralLinks: [
                {
                    linkTitle: String,
                    link: String
                }
            ],
            lessons: [lessonSchema],
        }
    ]
})

const coursesSchema = new mongoose.Schema({
    courses: [courseSchema],
    discountCodes: [
        {
            code: String,
            discountMount: String
        }
    ]
})

const Courses = mongoose.models.courses || mongoose.model('courses', coursesSchema)
export default Courses;