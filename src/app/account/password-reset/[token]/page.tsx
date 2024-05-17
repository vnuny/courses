"use client";
import Header from '@/app/components/ui/Header';
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPasswordPage({ params }: any) {

    const [data, setData] = useState({
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState('')
    const [Btnloading, BtnsetLoading] = useState(false)
    const [tokenvalid, setTokenValid] = useState(false)
    const [pageloading, setPageLoading] = useState(true)
    const [success, setSuccess] = useState(false)


    useEffect(() => {
        async function checkToken(){
            try {
                const response = await axios.get('/api/account/password-reset', {
                    params: {
                        token: params.token
                    }
                })
                if(response.status === 200){
                    setTokenValid(true)
                    setPageLoading(false)
                }
                console.log(response);
            } catch (error:any) {
                if(error.response.status === 402){
                    setTokenValid(false)
                    setPageLoading(false)
                }else if(error.response.status === 500){
                    console.log(error);
                    setTokenValid(false)
                    setPageLoading(false)
                }
            }
        }
        checkToken()
    }, [])

    const submit = async (e: any) => {
        BtnsetLoading(true);
        e.preventDefault();
        if(data.password !== data.confirmPassword){
            setError('كلمة المرور غير متطابقة')
            return
        }
        try {
            const response = await axios.post('/api/account/password-reset', {
                token: params.token,
                password: data.password
            });
            if (response.status === 200) {
                console.log(response);
                setSuccess(true);
            }
        } catch (error) {
            console.log(error);
            setError('حدث خطأ ما');
            BtnsetLoading(false);
        }
    }

    if(pageloading){
        return (
            <main className={styles.main}>
                <Header/>
                <div className={styles.container}>
                    <i style={{
                        fontSize: '2em',
                        color: 'var(--txt)',
                    }} className="fa-solid fa-spinner-third fa-spin"></i>
                </div>
            </main>
        )
    }
    return (
        <main className={styles.main}>
            <Header/>
            <div dir='rtl' className={styles.container}>
                {tokenvalid ? (
                    <>
                    {
                        !success ? (
                            <>
                                <h3 style={{color: 'var(--txt)'}}>اعادة تعيين كلمة المرور</h3>
                                {error.length > 0 && <p style={{ color: 'var(--red)',marginBottom: '10px' }}>{error}</p>}
                                <input style={{color: 'var(--txt)',height: '50px', backgroundColor: 'transparent', border: error.length > 0 ? '1px solid var(--red)' : '1px solid var(--txtH)'}} onChange={(e) => setData({ ...data, password: e.target.value })} type="password" placeholder="كلمة المرور الجديدة" />
                                <input style={{
                                    color: 'var(--txt)',
                                    height: '50px',
                                    backgroundColor: 'transparent',
                                    border: error.length > 0 ? '1px solid var(--red)' : '1px solid var(--txtH)',
                                }} onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} type="password" placeholder="تأكيد كلمة المرور الجديدة" />
                                <button style={{backgroundColor: 'var(--primary)', color: 'var(--bg)', fontWeight: '500'}}  disabled={data.password !== data.confirmPassword || Btnloading} onClick={submit}>{Btnloading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'ارسال'}</button>
                            </>
                        ): (
                            <>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: '1px solid var(--txt)',
                                    borderRadius: '20px',
                                    padding: '20px 15px',
                                    paddingBottom: '10px',
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '3em',
                                        color: 'white',
                                        marginBottom: '30px',
                                    }}>
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <h3 style={{color: 'var(--txt)'}}>تم اعادة تعيين كلمة المرور بنجاح</h3>
                                    <Link style={{
                                        color: 'var(--bg)',
                                        backgroundColor: 'var(--primary)',
                                        width: '100%',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        padding: '10px 0px',
                                        borderRadius: '10px',
                                        margin: '10px 0px',
                                        fontWeight: '500',
                                    }} href="/account/login">تسجيل الدخول</Link>
                                </div>
                            </>
                        )
                    }
                    </>
                ):(
                    <>
                        <h2 style={{color: 'var(--red)', marginBottom: '10px'}}>الرابط غير صالح</h2>
                        <Link style={{
                            color: 'var(--bg)',
                            backgroundColor: 'var(--primary)',
                            width: '200px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: '10px 0px',
                            borderRadius: '10px',
                            margin: '10px 0px',
                            fontWeight: '500',
                        }} href="/">الصفحة الرئيسية</Link>
                    </>
                )}
            </div>
        </main>
    )
}