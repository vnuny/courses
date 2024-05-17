import connect from "@/dbconfig/connect";
import User from "@/model/usersModel";
import { NextRequest , NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
import { sendEmail } from "@/helper/Email";


export async function POST (request: NextRequest) {
    try {   
        const reqBody = await request.json();
        const { email } = reqBody;
        await connect();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({message: 'هذا الحساب غير موجود الرجاء انشاء حساب جديد'}, {status: 400});
        }
        const token = jwt.sign({email}, process.env.JWT_SECRET!, {expiresIn: '2h'});
        const url = `http://localhost:3000/account/resetpassword/${token}`;
        await sendEmail(email, 'تغيير كلمة المرور', url);
        return NextResponse.json({message: 'تم ارسال رابط تغيير كلمة المرور'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }   
}