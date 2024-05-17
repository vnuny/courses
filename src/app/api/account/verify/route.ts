import connect from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const fullDate = `${year}/${month}/${day}`;
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        if(!token){
            return NextResponse.json({message: 'no token provided'}, {status: 400});
        }
        const decodeToken:any = jwt.verify(token, process.env.JWT_SECRET!);
        if(!decodeToken){
            return NextResponse.json({message: 'invalid token'}, {status: 400});
        }
        await connect();
        const user = await User.findOne({email: decodeToken.email});
        if(user){
            return NextResponse.json({message: 'user aleady exist'}, {status: 404});
        }
        const newUser = new User({
            name: decodeToken.name,
            email: decodeToken.email,
            password: decodeToken.password,
            token: decodeToken.token,
            joinedAt: fullDate,
            role: decodeToken.role,
            profilePicBuffer: '',
            bio: '',
            phoneNumber: '',
            update_courses_notifications: true,
            enable_offers_notifications: false
        })
        await newUser.save();
        const response = NextResponse.json({message: 'success'}, {status: 200});
        response.cookies.delete('tempToken');
        return response;
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({message: 'token expired'}, {status: 402});
        }
        return NextResponse.json({error}, {status: 500});
    }
}