"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from './style.module.scss'
import { ChevronLeft, CreditCard, Loader, ServerCrash } from "lucide-react";
import Link from "next/link";
export default function CompleteOrder() {
    const params = useSearchParams();
    const token = params.get('token')
    const courseId = params.get('courseId')
    const mount = params.get('mount')
    console.log(token, courseId, mount)

    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(true)
    useEffect(() => {
        setLoading(true)
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await axios.post('/api/checkout/capture', {
                    orderId: token,
                    courseId: courseId,
                    mount: mount
                })
                console.log(response)
                setSuccess(true)
                setLoading(false)
            } catch (error) {
                setSuccess(false)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
        return () => {
            fetch();
        }
    },[])
    return (
        <main className={styles.main}>
           {!loading ? (
                <div className={styles.box}>
                    {success ? (
                        <>
                            <div className={styles.icon}>
                                <CreditCard />
                            </div>
                            <h3>تمت عملية الدفع بنجاح</h3>
                            <p>ستجد فاتورة الشراء في صندوق بريدك الإلكتروني</p>
                            <Link href={'/'} className={styles.btn}>الصفحة الرئيسية <ChevronLeft /></Link>
                        </>
                    ) : (
                        <>
                            <div className={styles.icon}>
                                <ServerCrash color={'var(--red)'} />
                            </div>
                            <h3>حدث خطأ ما</h3>
                            <p>حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى</p>
                            <Link href={'/'} className={styles.btn}>الصفحة الرئيسية <ChevronLeft /></Link>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.loading}>
                    <Loader color={'var(--primary)'} />
                </div>
            )}
        </main>
    )
}