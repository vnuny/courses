import connect from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export async function POST (request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        await connect();
        const user = await User.findOne({email});
        if(user && user.googleConnected === true){
            return NextResponse.json({message: 'الرجاء تسجيل الدخول بواسطة جوجل'}, {status: 400});
        }else if(user){
            const isMatch = await bcryptjs.compare(password, user.password);
            if(!isMatch){
                return NextResponse.json({message: 'كلمة المرور غير صحيحة'}, {status: 400});
            }
            const userToken = user.token;
            const response = NextResponse.json({message: 'success'}, {status: 200});
            response.cookies.delete('tempToken');
            response.cookies.set('token', userToken, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
            return response;
        }else if(!user){
            return NextResponse.json({message: 'هذا الحساب غير موجود الرجاء انشاء حساب جديد'}, {status: 400});
        }
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }   
}