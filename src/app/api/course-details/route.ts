import { NextRequest, NextResponse } from "next/server";
import Courses from "@/model/coursesModel";
import User from "@/model/usersModel";
import connectDB from "@/dbconfig/connect";

export async function POST(request: NextRequest) {
    try {
        const userToken = request.cookies.get('token')?.value;
        const reqBody = await request.json();
        const { course_id } = reqBody;
        connectDB();
        if (userToken) {
            const user = await User.findOne({ token: userToken });
            if (!user) {
                return NextResponse.json({ message: 'invalid token' }, { status: 400 });
            }
            const allCoursesDataBase:any = await Courses.find({});
            const courses = allCoursesDataBase[0].courses;
            const getTheCourse = courses.find((course: any) => String(course._id) === String(course_id));
            const userCourses = user.purchasedCourses.filter((pc: any) => String(pc.course) === String(course_id));
            console.log(userCourses)
            if(getTheCourse && userCourses.length > 0){
                return NextResponse.json({ course: getTheCourse, lessonsProgress: userCourses[0].lessonsProgress });
            }else{
                return NextResponse.json({ course: {
                    course_id: getTheCourse._id,
                    title: getTheCourse.title,
                    img: getTheCourse.img,
                    generalDesc: getTheCourse.generalDesc,
                    price: getTheCourse.price,
                    date: getTheCourse.date,
                    rating: getTheCourse.rating,
                    orderedCount: getTheCourse.orderedCount,
                    courseAdvantages: getTheCourse.courseAdvantages,
                    Collisions: getTheCourse.Collisions.map((collision: any) => collision.collisionsTitle),
                    owned: false
                } });
            }
        }else{
            const allCoursesDataBase:any = await Courses.find({});
            const courses = allCoursesDataBase[0].courses;
            const getTheCourse = courses.find((course: any) => String(course._id) === String(course_id));
                return NextResponse.json({ course: {
                    course_id: getTheCourse._id,
                    title: getTheCourse.title,
                    img: getTheCourse.img,
                    generalDesc: getTheCourse.generalDesc,
                    price: getTheCourse.price,
                    date: getTheCourse.date,
                    rating: getTheCourse.rating,
                    orderedCount: getTheCourse.orderedCount,
                    courseAdvantages: getTheCourse.courseAdvantages,
                    Collisions: getTheCourse.Collisions.map((collision: any) => collision.collisionsTitle),
                    owned: false
                } });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}