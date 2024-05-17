import connectDB from "@/dbconfig/connect";
import Courses from "@/model/coursesModel";
import User from "@/model/usersModel";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userToken = request.cookies.get('token')?.value || '';
        await connectDB();
        const user = await User.findOne({ token: userToken });
        const allCoursesDataBase:any = await Courses.find({});
        if (user) {
            const course = allCoursesDataBase[0].courses;
            const restData = course.map((course:any) => {
                const purchasedCourse = user.purchasedCourses.find((pc:any) => 
                    String(pc.course) === String(course._id)
                );
                console.log(course)
                
                const isOwned = !!purchasedCourse;
                const progress = isOwned ? purchasedCourse.progress : 0;
    
                return {
                    title: course.title,
                    img: course.img,
                    id: course._id,
                    desc: course.generalDesc,
                    Collisions: course.Collisions.map((collision:any) => collision.collisionsTitle),
                    price: course.price,
                    date: course.date,
                    rating: course.rating,
                    orderedCount: course.orderedCount,
                    owned: isOwned,
                    progress: progress
                };
            });
    
            return NextResponse.json({ message: 'success', data: restData }, { status: 200 });
        }else{
            const course = allCoursesDataBase[0].courses;
            const restData = course.map((course:any) => {
    
                return {
                    title: course.title,
                    img: course.img,
                    id: course._id,
                    desc: course.generalDesc,
                    Collisions: course.Collisions.map((collision:any) => collision.collisionsTitle),
                    price: course.price,
                    date: course.date,
                    rating: course.rating,
                    orderedCount: course.orderedCount,
                    owned: false,
                    progress: 0
                };
            });
    
            return NextResponse.json({ message: 'success', data: restData }, { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: 'Error fetching courses' }, { status: 500 });
    }
}
