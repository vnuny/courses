import { NextRequest, NextResponse } from "next/server";
import User from "@/model/usersModel";
import connectDB from "@/dbconfig/connect";

function calculateProgress(lessons:any) {
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson: any) => lesson.done).length;
    const progress = (completedLessons / totalLessons) * 100;
    return progress.toFixed(2);;
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { LessonId, courseId } = reqBody;
        console.log(LessonId, courseId);
        const token = request.cookies.get('token')?.value;
        if(!token) {
            return NextResponse.json({message: 'no token provided'}, {status: 400});
        }
        if(!LessonId) {
            return NextResponse.json({message: 'no LessonId provided'}, {status: 400});
        }
        await connectDB();
        const user = await User.findOne({token: token});
        if(!user) {
            return NextResponse.json({message: 'invalid token'}, {status: 400});
        }
        const course = user.purchasedCourses.find((course: any) => course.course == courseId);
        if(!course) {
            return NextResponse.json({message: 'course not found'}, {status: 400});
        }
        const lesson = course.lessonsProgress.find((lesson: any) => lesson._id == LessonId);
        if(!lesson) {
            return NextResponse.json({message: 'lesson not found'}, {status: 400});
        }
        lesson.done = true;
        const savedUser = await user.save();
        const newLessonsProgress = savedUser.purchasedCourses.find((course: any) => course.course == courseId).lessonsProgress;
        const progress = calculateProgress(newLessonsProgress);
        user.purchasedCourses.find((course: any) => course.course == courseId).progress = progress;
        const savedUser2 = await user.save();
        return NextResponse.json({newLessonsProgress}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error}, {status: 500});
    }
}
