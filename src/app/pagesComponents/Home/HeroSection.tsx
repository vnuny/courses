import { MoveLeft, Sparkles, UsersRound } from 'lucide-react'
import styles from './style.module.scss'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react';
export default function HeroSection() {
    const token = Cookies.get('token');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    useEffect(() => {
        if (token) {
            setIsUserLoggedIn(true);
        }else{
            setIsUserLoggedIn(false);
        }
    })
    return (
        <main className={styles.main}>
            <div className={styles.hero}>
                <div className={styles.poster}>
                    <span className={styles.offer}>خصم خاص للمجوعات <UsersRound /></span>
                    <div className={styles.overlay}>
                        <p>قدرات لفظي</p>
                        <p>قدرات كمي</p>
                        <p>لغة انجليزية</p>
                        <p>رياضيات</p>
                    </div>
                </div>
                <div className={styles.text}>
                    <h2>تعلم أونلاين وتأسس صح <span><Sparkles/></span></h2>
                    <p>تأسس صح في القدرات اللفظي والكمي ولا تضيع وقت!</p>
                    <div className={styles.btns}>
                        {isUserLoggedIn ? <Link href={'/profile/courses'}>كورساتي</Link>: <Link href={'/account/signup'}>سجل الان !</Link>}
                        <Link href={'/about'}>اعرف اكثر  <MoveLeft /></Link>
                    </div>
                </div>
            </div>
            <div className={styles.advantages}>
                <h2 className={styles.title}>لماذا دوراتنا هي افضل خيار لك ؟</h2>
                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <img src="https://static.vecteezy.com/system/resources/previews/008/854/753/original/3d-medal-icon-illustration-png.png" alt="" />
                        </div>
                        <div className={styles.info}>
                            <h3>أساس قوي للقدرات</h3>
                            <p>دوراتنا هي الأفضل لك وتساعدك على تحقيق نجاحك</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <img src="https://static.vecteezy.com/system/resources/previews/008/486/028/original/stylized-circle-clock-icon-minimal-alarm-clock-ringing-speed-time-icon-fast-and-quick-3d-rendering-illustration-png.png" alt="" />
                        </div>
                        <div className={styles.info}>
                            <h3>أساس قوي للقدرات</h3>
                            <p>دوراتنا هي الأفضل لك وتساعدك على تحقيق نجاحك</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <img src="https://cdn3.iconfinder.com/data/icons/business-3d-illustration-set/512/BusinessVOne07.png" alt="" />
                        </div>
                        <div className={styles.info}>
                            <h3>أساس قوي للقدرات</h3>
                            <p>دوراتنا هي الأفضل لك وتساعدك على تحقيق نجاحك</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}