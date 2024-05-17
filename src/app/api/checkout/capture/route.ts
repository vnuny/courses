import User from "@/model/usersModel"
import axios from "axios"
import { NextResponse } from "next/server"
import Courses from "@/model/coursesModel"

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL! + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID!,
            password: process.env.PAYPAL_SECRET!
        }
    })
    return response.data.access_token
}
const capturePayment = async (orderId: any) => {
    const accessToken = await generateAccessToken()
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })
    return response.data
}


function getCurrentTime12Hour() {
    // Get current date/time
    const now:any = new Date();
  
    // Extract hours, minutes, and seconds
    let hours:any = now.getHours();
    let minutes:any = now.getMinutes();
    let seconds:any = now.getSeconds();
  
    // Determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Handles the case where hours is 0
  
    // Format minutes and seconds to have leading zeros if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  
    // Construct the 12-hour time string
    const time12Hour = `${hours}:${minutes} ${amOrPm}`;
  
    return time12Hour;
  }


  async function getAllLessons(theCourse: any) {
    const lessonsArray:any = [];
    theCourse.Collisions.forEach((collision:any) => {
        collision.lessons.forEach((lesson:any) => {
            const newLesson:any = {
                _id: lesson._id,
                done: false
            };
            lessonsArray.push(newLesson);
        });
    });
    return lessonsArray;
}


export async function POST(request: any) {
    const { orderId,courseId, mount } = await request.json()
    const token = request.cookies.get('token')?.value;
    if(!orderId || !token) {
        return NextResponse.json({message: 'no order id provided'}, {status: 400})
    }
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return NextResponse.json({message: 'invalid token'}, {status: 400})
        }
        const response = await capturePayment(orderId)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const fullDate = `${year}/${month}/${day}`;
        const coursesDocument = await Courses.findOne({});
    if (!coursesDocument) {
        return NextResponse.json({ message: 'Courses not found' }, { status: 404 });
    }
    const courses = coursesDocument.courses;
    const getTheCourse = courses.find((course:any) => String(course._id) === String(courseId));
    if (!getTheCourse) {
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    const allLessons = await getAllLessons(getTheCourse);
    console.log(allLessons);
    getTheCourse.orderedCount = getTheCourse.orderedCount + 1;
    const notificationForm = {
        title: 'تم شراء الكورس بنجاح',
        description: 'ستجد الكورس في مجموعة كورساتي',
        time: getCurrentTime12Hour(),
        date: fullDate,
        seen: false,
        link: 'https://localhost:3000/course/' + courseId,
        type: 'success',
    }
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
            {
                $push: {
                    purchasedCourses: {
                        course: courseId,
                        progress: 0,
                        date: fullDate,
                        purchasedPrice: mount,
                        lessonsProgress: allLessons
                    },
                    notifications: notificationForm,
                }
            },
            { new: true }
        );
        await coursesDocument.save();
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}