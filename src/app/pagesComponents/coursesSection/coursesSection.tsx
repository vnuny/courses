import { Star } from 'lucide-react'
import styles from './style.module.scss'
import courseComponent from '../../components/CourseCard'
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function CoursesSection() {
    // const coursess = [
    //     {
    //         title: 'قدرات لفظي',
    //         img: 'https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://cdn.filestackcontent.com/K8RNVcQETXyj0hL1SxQb',
    //         link: '/course/1',
    //         desc: 'هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحة.',
    //         price: '20.77',
    //         date: '12/3/2022',
    //         orderedCount: 133,
    //         rating: 2.3,
    //         id: 1,
    //         owned: false,
    //         progress: 0
    //     },
    //     {
    //         title: 'قدرات لفظي',
    //         img: 'https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://cdn.filestackcontent.com/pyUCDOKwRhOlCvF40YA3',
    //         link: '/course/1',
    //         desc: 'هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحة.',
    //         price: '20.77',
    //         date: '12/3/2022',
    //         orderedCount: 133,
    //         rating: 4.5,
    //         id: 2,
    //         owned: true,
    //         progress: 0
    //     },
    //     {
    //         title: 'قدرات لفظي',
    //         img: 'https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://cdn.filestackcontent.com/2OOquXV4SiS5ojLrXEYq',
    //         link: '/course/1',
    //         desc: 'هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحة.',
    //         price: '20.77',
    //         date: '12/3/2022',
    //         orderedCount: 32,
    //         rating: 2.5,
    //         id: 3,
    //         owned: false,
    //         progress: 0
    //     }
    // ]

        const [courses, setCourses] = useState([])

        useEffect(() => {
            const getAllCourses = async () => {
                try {
                    const response = await axios.get('/api/courses');
                    setCourses(response.data.data)
                    console.log(response.data.data)
                } catch (error) {
                    console.log(error)
                }
            }
            getAllCourses()
        }, [])
    return (
        <main className={styles.main}>
            <h2 className={styles.title}>الدورات</h2>
            <div className={styles.cardsGrid}>
                {courses.map((course) => courseComponent(course))}
            </div>
            <div className={styles.howToUse}>
                <h2 className={styles.title}>خطوات التسجيل في دوراتنا</h2>
                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <span>01</span>
                        <div className={styles.icon}>
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/profile-privacy-5581185-4668699.png" alt="" />
                        </div>
                        <h3>قم بتسجيل الدخول على الموقع بأستخدام بريدك الالكترونى او رقم الهاتف.</h3>
                    </div>
                    <div className={styles.card}>
                        <span>02</span>
                        <div className={styles.icon}>
                            <img src="https://png.pngtree.com/png-clipart/20220908/ourmid/pngtree-search-3d-icon-render-png-image_6142351.png" alt="" />
                        </div>
                        <h3>اختر الدورة اللي ترغب في الاشتراك بها وتعرف على تفاصيلها</h3>
                    </div>
                    <div className={styles.card}>
                        <span>03</span>
                        <div className={styles.icon}>
                            <img src="https://static.vecteezy.com/system/resources/previews/013/484/033/original/digital-payment-3d-icon-png.png" alt="" />
                        </div>
                        <h3>اضغط على "شراء الدورة الان" وأكمل إجراءات الدفع</h3>
                    </div>
                    <div className={styles.card}>
                        <span>04</span>
                        <div className={styles.icon}>
                            <img src="https://static.vecteezy.com/system/resources/thumbnails/012/487/877/small_2x/3d-paper-sheets-with-check-marks-on-transparent-confirmed-or-approved-document-icon-beige-clipboard-with-checklist-symbol-assignment-done-business-cartoon-style-3d-icon-render-illustration-png.png" alt="" />
                        </div>
                        <h3>بمجرد إتمام عملية الشراء. ستظهر الدورة في قائمة دوراتك</h3>
                    </div>
                </div>
            </div>
        </main>
    )
}