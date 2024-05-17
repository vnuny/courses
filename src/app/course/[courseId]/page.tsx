"use client";

import Header from "@/app/components/ui/Header";
import styles from './style.module.scss'
import SideList from "../comps/sideList";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";
import Link from "next/link";
import FullPageLoading from "@/app/components/ui/FullPageLoading";

export default function Page({params}:any) {
    const [course, setCourse]:any = useState({})
    const [loading, setLoading]:any = useState(true)
    const [userData, setUserData]:any = useState(null)
    const [lessonsProgress, setLessonsProgress]:any = useState([])
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.post('/api/course-details', {
                    course_id: params.courseId
                })
                console.log(response.data)
                setCourse(response.data.course)
                setLessonsProgress(response.data.lessonsProgress)

                const userData = await axios.get('/api/account')
                setUserData(userData.data.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        return () => {
            fetch()
        }
    }, [])
    if (loading) return <FullPageLoading loading={loading}/>
    return (
        <main className={styles.main}>
            <Header userData={userData}/>
            <div className={styles.wrapper}>
                <SideList lessonsProgress={lessonsProgress} course={course}  blank={true} />
                <div className={styles.content}>
                    <div className={styles.box}>
                        <h2>{course.title}</h2>
                        <h3>{course.generalDesc}</h3>
                        <div className={styles.courseAdvantages}>
                            <h2>مميزات الكورس :</h2>
                            {course.courseAdvantages.map((advantage:any, index:any) => <h3 key={index}>{advantage} <Info/></h3>)}
                        </div>
                        <div className={styles.btns}>
                            {course.owned || course?.Collisions[0]?.lessons ? (
                                <Link href={`/course/${course._id}/${course.Collisions[0].lessons[0]._id}`}>أبدأ الان</Link>
                            ) : (
                                <Link href={`/checkout/${params.courseId}`}>شراء الأن بسعر {course.price}$</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}