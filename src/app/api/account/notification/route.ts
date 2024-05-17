import { NextRequest, NextResponse } from "next/server";
import User from "@/model/usersModel";
import connectDB from "@/dbconfig/connect";


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'method not allowed' }, { status: 400 });
        }
        connectDB();
        const user = await User.findOne({ token: token });
        if (!user) {
            return NextResponse.json({ message: 'user not found' }, { status: 400 });
        }
        const {update_courses_notifications, enable_offers_notifications} = reqBody;
        user.update_courses_notifications = update_courses_notifications;
        user.enable_offers_notifications = enable_offers_notifications;
        await user.save();
        return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}