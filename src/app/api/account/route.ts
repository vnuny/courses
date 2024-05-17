import connectDB from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
    try {
        const userToken = request.cookies.get('token')?.value;
        if(!userToken) {
            return NextResponse.json({message: 'no token provided'}, {status: 400});
        }
        await connectDB();
        const user = await User.findOne({token: userToken});
        if(!user) {
            return NextResponse.json({message: 'invalid token'}, {status: 400});
        }
        const data = {
            name: user.name,
            email: user.email,
            joinedAt: user.joinedAt,
            profilePicBuffer: user.profilePicBuffer.length > 0 ? '0' : '',
            role: user.role,
            cart: user.cart,
            notifications: user.notifications,
            _id: user._id,
            bio: user.bio,
            phoneNumber: user.phoneNumber,
            update_courses_notifications: user.update_courses_notifications,
            enable_offers_notifications: user.enable_offers_notifications,
            purchasedCourses: user.purchasedCourses,
        }
        return NextResponse.json({data}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }    
}



export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { bio, phoneNumber,username } = reqBody;
        const userToken = request.cookies.get('token')?.value;
        if(!userToken) {
            return NextResponse.json({message: 'no token provided'}, {status: 400});
        }
        await connectDB();
        const user = await User.findOne({token: userToken});
        if(!user) {
            return NextResponse.json({message: 'invalid token'}, {status: 400});
        }
        user.bio = bio;
        user.phoneNumber = phoneNumber;
        user.name = username;
        await user.save();
        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}