"use client";
import Header from "@/app/components/ui/Header";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";



export default function forgetPassword() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const submit = async (e:any) => {
        setLoading(true);
        if(email === '') {
            setError('الرجاء أدخال البريد الإلكتروني');
            setLoading(false);
            return;
        }else if(!email.includes('@') || !email.includes('.')) {
            setError('البريد الإلكتروني غير صالح');
            setLoading(false);
            return;
        }else if(email.length < 6) {
            setError('البريد الإلكتروني غير صالح');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/account/login/forgot-password', {email});
            if(response.status === 200) {
                setSuccess(true);
                setEmail('');
            }
        } catch (error:any) {
            setLoading(false);
            if(error.response.status === 400) {
                setError('البريد الإلكتروني غير مسجل الرجاء إنشاء حساب جديد');
            }
        } finally {
            setLoading(false);
        }
    }
    return(
        <main style={{height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Header />
            <div dir="rtl" className="box" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {
                   !success ? (
                        <>
                            <h3 style={{marginBottom: '20px', fontSize: '1.8em', color: 'var(--txt)'}}>اعادة تعيين كلمة المرور</h3>
                            <p style={{
                                color: 'var(--red)',
                                marginBottom: '10px',
                                transition: 'all 0.4s ease'
                            }}>{error}</p>
                            <input onMouseLeave={(e:any)=>{e.target.style.border = '1px solid var(--txt)';}} value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="البريد الالكتروني" style={{marginBottom: '20px', width: '100%',border: error.length > 0 ? '1px solid var(--red)' : '1px solid var(--txt)', outline: 'none', height: '40px', borderRadius: '10px', padding: '0px 20px', backgroundColor: 'transparent', color: 'var(--txt)'}}  />
                            <button disabled={loading} onClick={submit} style={{width: '100%',display: 'flex', alignItems: 'center', justifyContent: 'space-between',padding: '0px 20px', flexDirection: 'row-reverse', height: '40px', borderRadius: '10px', border: 'none', outline: 'none', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'var(--bg)', fontSize: '1.1em'}} >{loading ? (<i className="fa-solid fa-circle-notch fa-spin"></i>) : <><i className="fa-solid fa-angle-left"></i> ارسال رابط</>}</button>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '300px',
                            border: '1px solid var(--txt)',
                            padding: '10px',
                            borderRadius: '15px',
                            paddingTop: '30px', 
                            paddingBottom: '4px',
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3em',
                                color: 'white',
                                marginBottom: '30px',
                                backgroundColor: 'var(--primary)'

                            }}>
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h3  style={{
                                marginBottom: '20px',
                                color: 'var(--txt)',
                                paddingRight: '10px',
                                fontWeight: 'normal',
                                fontSize: '1em',
                                padding: '0px 10px',
                            }}>تم ارسال رابط اعادة تعيين كلمة المرور الي البريد الالكتروني.</h3>
                            <Link style={{
                                color: 'var(--secondary)',
                                backgroundColor: 'var(--primary)',
                                width: '100%',
                                cursor: 'pointer',
                                textAlign: 'center',
                                padding: '10px 0px',
                                borderRadius: '10px',
                                margin: '10px 0px',
                                fontWeight: 'bold',
                            }} href="/account/login">تسجيل الدخول</Link>
                        </div>
                    )
                }
            </div>
        </main>
    )
}