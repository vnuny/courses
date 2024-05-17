import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Courses from "@/model/coursesModel";

// Function to generate access token from PayPal
async function generateAccessToken() {
    try {
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL!}/v1/oauth2/token`,
            method: 'post',
            data: 'grant_type=client_credentials',
            auth: {
                username: process.env.PAYPAL_CLIENT_ID!,
                password: process.env.PAYPAL_SECRET!
            }
        });
        
        return response.data.access_token;
    } catch (error:any) {
        throw new Error(`Failed to generate access token: ${error.message}`);
    }
}

// Function to create a PayPal order
const createOrder = async (title:any, price:any, courseId:any) => {
    try {
        const title_string = await title;
        const price_string = await price;
        const courseId_string = await courseId;
        const accessToken = await generateAccessToken();
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: title_string,
                                description: 'كورس تعليمي من موقع علي',
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: `${price_string}`
                                }
                            }
                        ],
                        amount: {
                            currency_code: 'USD',
                            value: `${price_string}`,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: `${price_string}`
                                }
                            }
                        }
                    }
                ],
                application_context: {
                    return_url: `${process.env.BASE_URL}/complete-order?courseId=${courseId_string}&mount=${price_string}`,
                    cancel_url: `${process.env.BASE_URL}/cancel-order`,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'Vertas',
                }
            }
        });

        const approvalLink = response.data.links.find((link:any) => link.rel === 'approve').href;
        return approvalLink;
    } catch (error:any) {
        throw new Error(error);
    }
};

function calculateDiscountedPrice(originalPrice:any, discountPercentage:any) {
    if (discountPercentage < 0 || discountPercentage > 100) {
        throw new Error('Discount percentage must be between 0% and 100%.');
    }
    const discountAmount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
}

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { discountCode, courseId } = reqBody;
    if(!courseId){
        return NextResponse.json({ error: 'Failed to process the request.' }, { status: 500 });
    }
    try {
        if(discountCode){
            const AlldiscountCodes = await Courses.findById('663b43ba434483b2147afdcf');
            if (!AlldiscountCodes) {
                return NextResponse.json({ dbCode: null }, { status: 404 });
            }
            const foundCode:any = AlldiscountCodes.discountCodes.filter((dbCode: any) => dbCode.code === discountCode)[0];
            if(!foundCode){
                return NextResponse.json({ dbCode: null }, { status: 404 });
            }
            const allCoursesDataBase:any = await Courses.find({});
            const courses = allCoursesDataBase[0].courses;
            const getTheCourse = courses.find((course: any) => String(course._id) === String(courseId));
            const fianlPrice = calculateDiscountedPrice(getTheCourse.price, foundCode.discountMount).toFixed(2);
            const approvalUrl = await createOrder(getTheCourse.title, fianlPrice,courseId);
            return NextResponse.json({ url: approvalUrl,v: foundCode }, {status: 200});
        }else{
            const allCoursesDataBase:any = await Courses.find({});
            const courses = allCoursesDataBase[0].courses;
            const getTheCourse = courses.find((course: any) => String(course._id) === String(courseId));
            const approvalUrl = await createOrder(getTheCourse.title, getTheCourse.price,courseId);
            return NextResponse.json({ url: approvalUrl }, {status: 200});
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
