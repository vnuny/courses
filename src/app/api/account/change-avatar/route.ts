import User from '@/model/usersModel';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/dbconfig/connect';
import fs from 'node:fs'
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
export async function POST(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'method not allowed' }, { status: 400 });
    }
    
    connectDB();
    const user = await User.findOne({ token });
    if (!user) {
        return NextResponse.json({ message: 'user not found' }, { status: 400 });
    }

    const reqBody = await request.formData();
    const file:any = reqBody.get('avatar') as File;
    if (!file) {
        return NextResponse.json({ message: 'file not found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const finalUrl = `data:image/jpeg;base64,${base64Data}`;
    user.profilePicBuffer = finalUrl;
    await user.save();
    return NextResponse.json({ message: 'success' }, { status: 200 });
}
