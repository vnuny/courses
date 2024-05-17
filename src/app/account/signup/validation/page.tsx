"use client"
import { Mail } from "lucide-react"
import styles from '../../style.module.scss'
import { useRouter } from "next/navigation"
import Header from "@/app/components/ui/Header";

export default function validationPage() {
    const route = useRouter();
    return (
        <main>
            <Header />
            <div style={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                
            }}>
                <div className={styles.box}>
                    <div className={styles.icon}>
                        <Mail size={120}/>
                    </div>
                    <p>تحقق من بريدك الاكتروني لتأكيد حسابك</p>
                    <button onClick={() => route.push('/account/login')}>حسنا</button>
                </div>
            </div>
        </main>
    )
}