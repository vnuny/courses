"use client";
import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from '../../style.module.scss'
import { BadgeCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
export default function validationPage({params}:any) {
    const [linkValidated, setLinkValidated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useLayoutEffect(() => {
        async function verify() {
            try {
                const response = await axios.post('/api/account/verify', { token: params.token });
                setLinkValidated(true);
            } catch (error:any) {
                if (error.response && error.response.status === 403) {
                    setLinkValidated(false);
                }
            } finally {
                setLoading(false);
            }
        }
        return () => {
            console.log('helo');
            verify();
        }
    }, []);
    return (
        <main style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className={styles.box} style={{
                height: '285px',
                position: 'relative',
                border: loading ? 'none' : '1px solid var(--txt)',
            }}>
                {loading && <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                }}>
                    <i style={{
                        fontSize: '2em',
                        color: 'var(--txt)',
                    }} className="fa-solid fa-spinner-third fa-spin"></i>
                </div>}
                {
                    linkValidated ? (
                        <>
                            <div style={{opacity: loading ? 0 : 1}} className={styles.icon}>
                                <BadgeCheck size={120} />
                            </div>
                            <p style={{textAlign: 'end',marginTop: '20px',fontSize: '1.2em', opacity: loading ? 0 : 1}}>تم تأكيد البريد الإلكتروني بنجاح</p>
                            <button style={{opacity: loading ? 0 : 1}} onClick={() => {router.push('/account/login')}}>تسجيل الدخول</button>
                        </>
                    ):
                    (
                        <>
                            <div style={{opacity: loading ? 0 : 1}} className={styles.icon}>
                                <CircleX color="var(--red)" size={120} />
                            </div>
                            <p style={{textAlign: 'end',marginTop: '20px',fontSize: '1.2em',opacity: loading ? 0 : 1}}>الرابط غير صالح</p>
                            <button style={{opacity: loading ? 0 : 1}} onClick={() => {router.push('/account/login')}}>الصفحة الرئيسية</button>
                        </>
                    )
                }
            </div>
        </main>
    )
}