"use client";

import Header from "@/app/components/ui/Header";
import styles from './style.module.scss'
import courseComponent from "@/app/components/CourseCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Courses() {
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        async function fetchData() {
            try {
                const response = await axios.get('/api/account');
                setUserData(response.data.data)
                console.log(response.data.data)
                setLoading(false)
                const courses:any = [];
            
                if (response.data.data.purchasedCourses.length > 0) {
                    for (const item of response.data.data.purchasedCourses) {
                        try {
                            const courseResponse = await axios.post(`/api/course-details`,{
                                course_id: item.course
                            });
                            courses.push({
                                title: courseResponse.data.course.title,
                                img: courseResponse.data.course.img,
                                desc: courseResponse.data.course.generalDesc,
                                price: courseResponse.data.course.price,
                                date: courseResponse.data.course.date,
                                orderedCount: courseResponse.data.course.orderedCount,
                                rating: courseResponse.data.course.rating,
                                owned: true,
                                progress: item.progress,
                                id: courseResponse.data.course._id
                            });
                            console.log(courseResponse.data)
                        } catch (courseError) {
                            console.log(`Error fetching course details for courseId ${item.course}:`, courseError);
                        }
                    }
                }
                setData(courses);
            } catch (error) {
                console.log('Error fetching account data:', error);
            }
        }
        return () => {
            fetchData()
        }
    },[])
    return (
        <main className={styles.main}>
            {!loading && <Header userData={userData}/>}
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>كورساتي</h2>
                    <Link href={'/profile'}>عودة <ChevronLeft /></Link>
                </div>
                <div className={styles.coursesWrapper}>
                    {data.map((course) => courseComponent(course))}
                </div>
            </div>
        </main>
    )
}