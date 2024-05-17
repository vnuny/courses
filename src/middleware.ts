import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const tempToken = request.cookies.get('tempToken');
    const token = request.cookies.get('token');

    if (path === '/account'){
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/login' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/signup' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/password-reset' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/login/forgot-password' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/signup/validation' && !tempToken) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/account/verify') {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path.startsWith('/account/verify') && !tempToken) {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path === '/checkout') {
        return NextResponse.redirect(new URL('/', request.url));
    } else if (path.startsWith('/checkout/') && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    } else if (path === '/complete-order' && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    } else if (path === '/cancel-order' && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    } else if (path === '/profile' && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    } else if (path === '/profile/purchase_history' && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    } else if (path === '/profile/courses' && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    }
}

export const config = {
    matcher: [
        '/account',
        '/account/login',
        '/account/login/forgot-password',
        '/account/signup',
        '/account/signup/validation',
        '/account/verify',
        '/account/verify/:token*',
        '/account/password-reset',
        '/account/password-reset/:token*',
        '/checkout',
        '/checkout/:courseId*',
        '/complete-order',
        '/cancel-order',
        '/profile',
        '/profile/purchase_history',
        '/profile/courses',
    ]
};
