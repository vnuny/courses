import connectDB from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendEmail } from "@/helper/Email";

export async function POST(request: NextRequest) {
    let domain = request.url;
    const finalDomain = domain.replace('/api/account/signup', '');
    console.log(finalDomain);
    try {
        const reqBody = await request.json();
        const {name, email, password} = reqBody;
        console.log(name, email, password);
        await connectDB();
        const user = await User.findOne({email});
        if(user) {
            return NextResponse.json({message: "البريد الالكتروني موجود بالفعل الرجاء تسجيل الدخول"}, {status: 400});
        }
        const token = jwt.sign({email, name}, process.env.JWT_SECRET!);
        const hashedPassword = await bcrypt.hash(password, 10);
        const tempToken = jwt.sign({email, name, password: hashedPassword, token, role: 'user'}, process.env.JWT_SECRET!, {expiresIn: '2h'});
        await sendEmail(email, 'email validation', `<a href="${finalDomain}/account/verify/${tempToken}">Click here to verify your email</a>`);
        const response = NextResponse.json({message: "تم ارسال رابط التحقق الى بريدك الالكتروني"}, {status: 200});
        response.cookies.set({
            name: 'tempToken',
            value: tempToken,
            path: '/',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
        })
        return response;
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500});
    }
} 