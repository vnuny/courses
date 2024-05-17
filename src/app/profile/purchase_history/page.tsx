"use client";

import Header from "@/app/components/ui/Header";
import styles from './style.module.scss'
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios'
export default function PurchaseHistory() {
    const cardComp = ({title,price,date,link}:any) => {
        return(
            <tr>
                <td>{title}</td>         
                <td>{price}$</td>
                <td>{date}</td>
                <td>paypal</td>          
            </tr>
        )
    }
    const [data, setData] = useState<any[]>([])
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/api/account');
                setUserData(response.data.data)
                setLoading(false)
                console.log(response.data.data.purchasedCourses)
                const courses:any = [];
            
                if (response.data.data.purchasedCourses.length > 0) {
                    for (const item of response.data.data.purchasedCourses) {
                        const price = response.data.data.purchasedCourses.filter((course:any) => course.course === item.course)[0].purchasedPrice;
                        try {
                            const courseResponse = await axios.post(`/api/course-details`,{
                                course_id: item.course
                            });
                            courses.push({
                                title: courseResponse.data.course.title,
                                price: price,
                                date: item.date,
                                link: `/course/${courseResponse.data.course._id}`
                            });
                        } catch (courseError) {
                            console.log(`Error fetching course details for courseId ${item.course}:`, courseError);
                        }
                    }
                }
                setData(courses);
                console.log(courses);
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
                    <h2>سجل المشتريات</h2>
                    <Link href={'/profile'}>عودة <ChevronLeft /></Link>
                </div>
                <div className={styles.content}>
                    <div className={styles.box}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>اسم الدورة</th>
                                    <th>سعر الشراء</th>
                                    <th>تاريخ الشراء</th>
                                    <th>طريقة الدفع</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item:any) => cardComp(item))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}