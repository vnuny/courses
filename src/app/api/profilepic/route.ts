import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import User from '@/model/usersModel';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    try {
        // Construct the path to the local image file
        const imagePath = path.join(process.cwd(), 'public', 'girl.jpg');
        const user = await User.findById(userId);
        const base64ProfileImage = user?.profilePicBuffer;
        const imageDataPrefix = "data:image/jpeg;base64,";
        const base64ImageData = base64ProfileImage.replace(imageDataPrefix, '');
        // Set response headers
        const headers = {
            'Content-Type': 'image/jpeg',
        };
        return new NextResponse(Buffer.from(base64ImageData, 'base64'), { headers });
    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}