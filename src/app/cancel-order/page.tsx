"use client";

import styles from '../complete-order/style.module.scss'
import Link from 'next/link';
import { ChevronLeft, ServerCrash } from 'lucide-react';
export default function CancelOrder() {
    return(
        <main className={styles.main}>
            <div className={styles.box}>
            <>
                <div className={styles.icon}>
                                <ServerCrash color={'var(--red)'} />
                            </div>
                            <h3>حدث خطأ ما</h3>
                            <p>حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى</p>
                            <Link href={'/'} className={styles.btn}>الصفحة الرئيسية <ChevronLeft /></Link>
            </>
            </div>
        </main>
    )
}