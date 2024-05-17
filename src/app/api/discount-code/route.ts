import connectDB from "@/dbconfig/connect";
import { NextRequest, NextResponse } from "next/server";
import Courses from "@/model/coursesModel";


export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const code = params.get('code');

        await connectDB();

        const course = await Courses.findById('663b43ba434483b2147afdcf');

        if (!course) {
            // Handle case where course is not found
            return NextResponse.json({ dbCode: null }, { status: 404 });
        }

        const foundCode = course.discountCodes.find((dbCode: any) => dbCode.code === code);

        if (foundCode) {
            // Code found, return the code details
            return NextResponse.json({ dbCode: foundCode }, { status: 200 });
        } else {
            // Code not found
            return NextResponse.json({ dbCode: null }, { status: 404 });
        }
    } catch (error:any) {
        // Handle any errors that occur during database access or processing
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}