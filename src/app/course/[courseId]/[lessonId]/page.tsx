"use client";
import Header from '@/app/components/ui/Header';
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Link2, ServerCrash, SkipForward } from 'lucide-react';
import SideList from '../../comps/sideList';
import { useRouter } from 'next/navigation';

import FullPageLoading from '@/app/components/ui/FullPageLoading';
function getAllLessons(theCourse: any) {
    const lessonsArray:any = [];

    // Iterate over each collision category
    theCourse.Collisions.forEach((collision:any) => {
        // Iterate over each lesson within the collision category
        collision.lessons.forEach((lesson:any) => {
            // Create a new lesson object with necessary details
            const newLesson:any = {
                collisionsTitle: collision.collisionsTitle,
                lessonTitle: lesson.title,
                lessonDesc: lesson.desc,
                videoUrl: lesson.videoUrl,
                lessonIndex: lesson.lessonIndex,
                _id: lesson._id
            };

            // Add lesson links if available
            if (lesson.links && lesson.links.length > 0) {
                newLesson.links = lesson.links.map((link:any) => ({
                    linkTitle: link.linkTitle,
                    link: link.link
                }));
            }

            // Push the new lesson object to the lessonsArray
            lessonsArray.push(newLesson);
        });
    });
    return lessonsArray;
}



export default function Page({params}:any) {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData]:any = useState({});
    const [course, setCourse]:any = useState({});
    const [selectedLesson, setSelectedLesson]:any = useState({});
    const [allLessons, setAllLessons]:any = useState([]);
    const [isError, setIsError] = useState(true);
    const [lessonsProgress, setLessonsProgress]:any = useState([]);
    useEffect(() => {
       const fetch = async () =>{
           try {
                const response = await axios.get('/api/account/');
                const courseResponse = await axios.post('/api/course-details', {
                    course_id: params.courseId
                })
                setCourse(courseResponse.data.course);
                setLessonsProgress(courseResponse.data.lessonsProgress);
                const data = response.data.data;
                setUserData(data);
                setLoading(false);
                const theCourse = courseResponse.data.course;
                const allLessons = getAllLessons(theCourse);
                if(allLessons.length > 0) {
                    setIsError(false);
                }else{
                    setIsError(true);
                }
                await setAllLessons(allLessons);
                const selecedLesson = getAllLessons(theCourse).filter((lesson:any) => lesson._id === params.lessonId)[0];
                setSelectedLesson(selecedLesson);
                console.log(selecedLesson);
           } catch (error) {
               console.log(error);
               setLoading(false);
           }
       } 
       return () => {
           fetch();
       }
    },[])
    const router = useRouter();
    const handleSelectedLesson = (selectedLessonId:any) => {
        const selectedLesson = allLessons.filter((lesson:any) => lesson._id === selectedLessonId)[0];
        setSelectedLesson(selectedLesson)
        // router.push(`/course/${params.courseId}/${selectedLessonId}`, undefined);
    };
    if (loading) return <FullPageLoading loading={loading}/>;
    // const [isCourseEnd, setIsCourseEnd] = useState(false);
    const handleNextpage = async () => {
        const index = allLessons.findIndex((lesson:any) => lesson._id === selectedLesson._id);
        if(index < allLessons.length - 1) {
            const nextLesson = allLessons[index + 1];
            setSelectedLesson(nextLesson);
            router.push(`/course/${params.courseId}/${nextLesson._id}`, undefined);
        }else if(index === allLessons.length - 1) {
            // setIsCourseEnd(true);
            // router.push(`/course/${params.courseId}`, undefined);
        }
        try {
            const resonse = await axios.post('/api/course-lessons-actions', {
                courseId: params.courseId,
                LessonId: selectedLesson._id,
            })
            // setLessonsProgress(resonse.data.lessonsProgress);
            console.log(resonse.data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleCourseEnd = async() => {
        try {
            const resonse = await axios.post('/api/course-lessons-actions', {
                courseId: params.courseId,
                LessonId: selectedLesson._id,
            })
            // setLessonsProgress(resonse.data.lessonsProgress);
            console.log(resonse.data);
        } catch (error) {
            console.log(error);
        }
        router.push(`/course/${params.courseId}/done`, undefined);
    }
    return(
        <main className={styles.main} style={{
            paddingTop: isError ? '0px' : '120px',
        }}>
            <Header userData={userData}/>
            {
                allLessons.length > 0 ? (
                    <>
                        <div className={styles.header}>
                            <div className={styles.directory}>
                                <Link href={`/course/${params.courseId}`}>{course.title}</Link>
                                <span>/</span>
                                <Link href={`/course/${params.courseId}/${selectedLesson._id}`}>{selectedLesson.lessonTitle}</Link>
                            </div>
                            <Link href={`/course/${params.courseId}`} className={styles.back}>العودة <ChevronLeft /></Link>
                        </div>
                        <div className={styles.content}>
                            <SideList lessonsProgress={lessonsProgress} course={course} blank={false} onLessonSelect={handleSelectedLesson} />
                            <div className={styles.lessonContent}>
                                <div className={styles.vidBox}>
                                    <iframe src={selectedLesson.videoUrl} frameBorder={0} width="100%" height="100%" allowFullScreen>
                                    <span></span>
                                    </iframe>
                                </div>
                                <div className={styles.lessonInfo}>
                                    <h1>{selectedLesson.lessonTitle}</h1>
                                    <h3 className={styles.desc}>{selectedLesson.lessonDesc}</h3>
                                    {selectedLesson.links && selectedLesson.links.length > 0 && (
                                        <div className={styles.linksContainer}>
                                            <h3>الروابط</h3>
                                            <div className={styles.links}>
                                                {selectedLesson.links.map((link:any) => (
                                                    <a key={link.link} href={link.link} target="_blank" rel="noopener noreferrer"><Link2 />{link.linkTitle}</a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.btns}>
                                        <Link href={selectedLesson.lessonIndex !== 0 ? `/course/${params.courseId}/${allLessons[selectedLesson.lessonIndex - 1]._id}` : ''}>الدرس السابق <ChevronLeft /></Link>
                                        <button onClick={selectedLesson.lessonIndex === allLessons.length - 1 ? () => handleCourseEnd() : () => handleNextpage()}>{selectedLesson.lessonIndex === allLessons.length - 1 ? 'إنهاء الكورس' : 'الدرس التالي'}<SkipForward /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ): (
                    <main style={{
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '20px',
                    }}>
                        <div className={styles.box}>
                            <>
                                    <div className={styles.icon}>
                                        <ServerCrash color={'var(--red)'} />
                                    </div>
                                    <h3>حدث خطأ ما</h3>
                                    <p>حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى</p>
                                    <Link href={'/'} className={styles.btn}>الصفحة الرئيسية <ChevronLeft /></Link>
                            </>
                        </div>
                    </main>
                )
            }
        </main>
    )
}