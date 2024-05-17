"use client";
import { CheckCheck, LogOut, X } from 'lucide-react';
import styles from './style.module.scss'
import jscookie from 'js-cookie'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LogoutPage() {
    const router = useRouter();

    const [listOpen, setListOpen] = useState(false);



    const logout = async ()=>{
        jscookie.remove('token');
        jscookie.remove('tempToken');
        router.push('/');
    }

    return(
        <div className={styles.logoutWrapper}>
            <div className={styles.blockHeader}>
                <h2 className={styles.title}>تسجيل الخروج</h2>
            </div>
            <div className={styles.content}>
                <div className={styles.box}>
                    <button onClick={()=>{setListOpen(true)}}><h3>تسجيل الخروج</h3><LogOut /></button>
                    <h3>تسجيل الخروج من حسابك</h3>
                </div>
            </div>
            {listOpen && <div className={styles.confirmWrapper}>
                <div className={styles.card}>
                    <h3>هل انت متأكد من تسجيل الخروج؟</h3>
                    <div>
                        <button onClick={logout}>تسجيل الخروج</button>
                        <button onClick={()=>{setListOpen(false)}}>الغاء</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}