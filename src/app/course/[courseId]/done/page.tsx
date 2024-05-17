"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/ui/Header";
import { CheckCheck, ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import styles from './style.module.scss'

export default function Done() {
    return(
        <main className={styles.main}>
            <Header/>
            <div className={styles.box}>
                    <div className={styles.icon}>
                        <CheckCheck />
                    </div>
                    <h3>تهانينا على إتمام الدورة!</h3>
                    <p>نحن فخورون برؤية التزامك وعملك الجاد يؤتي ثماره. إن تفانيك في التعلم يلهمنا حقًا!

واصل العمل الرائع!

رحلتك لا يجب أن تتوقف هنا. هناك دائمًا المزيد لتتعلمه ومهارات جديدة لتكتسبها. اتخذ الخطوة التالية في رحلتك التعليمية من خلال التسجيل في دورة أخرى اليوم. سواء كنت تتطلع إلى تعميق معرفتك في مجالك الحالي أو استكشاف شيء جديد تمامًا، لدينا مجموعة واسعة من الدورات في انتظارك.</p>
                    <Link href={'/'} className={styles.btn}>الصفحة الرئيسية <ChevronLeft /></Link>
            </div>
        </main>
    )
}