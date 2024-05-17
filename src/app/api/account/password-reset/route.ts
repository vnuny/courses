import connect from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const token = params.get('token');
        if (!token) {
            return NextResponse.json({message: 'no token provided'}, {status: 400});
        }
        const decodeToken:any = jwt.verify(token, process.env.JWT_SECRET!);

        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({message: 'token expired'}, {status: 402});
        }
        return NextResponse.json({error: error}, {status: 500});
    }
}


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {password, token} = reqBody;
        const decodeToken:any = jwt.verify(token, process.env.JWT_SECRET!);
        if(!decodeToken){
            return NextResponse.json({message: 'invalid token'}, {status: 400});
        }
        await connect();
        const user = await User.findOne({email: decodeToken.email});
        if(!user){
            return NextResponse.json({message: 'user not found'}, {status: 400});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}