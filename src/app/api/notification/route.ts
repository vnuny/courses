import { NextResponse, NextRequest } from "next/server";
import User from "@/model/usersModel";



export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'method not allowed' }, { status: 400 });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return NextResponse.json({ message: 'user not found' }, { status: 400 });
        }
        
        const seenUpdatedNotifications = await user.notifications.map((notification:any) => {
            notification.seen = true;
            return notification;
        });
        await user.save();
        return NextResponse.json({ seenUpdatedNotifications }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}