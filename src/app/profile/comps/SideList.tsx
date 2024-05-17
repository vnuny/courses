"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './style.module.scss'
import Link from 'next/link';
import { useState } from 'react';
export default function SideList({}) {
    const [selected, setSelected] = useState('')
    const sections = [
        'edit',
        'notification',
        'courses',
        'purchases',
        'contact',
        'logout',
    ]
    const hanldeSelect = (section: string) => {
        
    }
    const selectedColor = 'black'
    return (
        <div className={styles.sideList}>
            <h2 className={styles.title}>اعدادات الحساب</h2>
            <div className={styles.listHolder}>
                <Link style={{backgroundColor: selected === 'edit' ? selectedColor : ''}} href={'#edit'} onClick={() => setSelected('edit')}>تعديل الملف الشخصي </Link>
                <Link style={{backgroundColor: selected === 'notification' ? selectedColor : ''}} href={'#notification'} onClick={() => setSelected('notification')}>الاشعارات </Link>
                <Link style={{backgroundColor: selected === 'courses' ? selectedColor : ''}}  href={'/profile/courses'} onClick={() => setSelected('courses')}>كورساتي </Link>
                <Link style={{backgroundColor: selected === 'purchases' ? selectedColor : ''}} href={'/profile/purchase_history'} onClick={() => setSelected('purchases')}>سجل المشتريات </Link>
                <Link style={{backgroundColor: selected === 'contact' ? selectedColor : ''}} href={'#contact'} onClick={() => setSelected('contact')}>تواصل معنا </Link>
                <Link style={{backgroundColor: selected === 'logout' ? selectedColor : ''}} href={'#logout'} onClick={() => setSelected('logout')}>تسجيل خروج </Link>
            </div>
        </div>
    )
}