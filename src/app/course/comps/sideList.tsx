"use client";


import { CheckCheck, ChevronDown, Link2, Lock, Play, PlayCircle, PlayIcon } from 'lucide-react';
import styles from './styles.module.scss'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SideList({course,blank,onLessonSelect,lessonsProgress}:any) {
    const [openIndices, setOpenIndices]:any = useState([]);
    const [open,setOpen] = useState(false)

    const handleCollostionList = (index:any) => {
        const isOpen = openIndices.includes(index);
        if (isOpen) {
            setOpenIndices(openIndices.filter((i:any) => i !== index));
        } else {
            setOpenIndices([...openIndices, index]);
        }
    };
    const isLessonCompleted = (lessonId: any) => {
        // Check if lessonsProgress is defined and not empty
        if (lessonsProgress && lessonsProgress.length > 0) {
            // Use filter to find the lesson with matching _id
            const lessonProgress = lessonsProgress.filter((lesson: any) => lesson._id === lessonId);
            // Check if any matching lesson was found and its completion status
            return lessonProgress.length > 0 && lessonProgress[0].done;
        }else{
            return false;
        }
    };

    const getHeight = (collision:any) => {
        const defaultHeight = 145;
        const linkHeight = 55;
        const numLinks = (collision.collisionGeneralLinks.length + collision.lessons.length) * 1; // +1 for each lesson/video link
        return defaultHeight + numLinks * linkHeight;
    };

    const handleSelectedLessonChange = (lessonId:any) => {
        if (typeof onLessonSelect === 'function') {
            onLessonSelect(lessonId);
        }
    };
    
    return (
        <>
            {course.Collisions[0].lessons ? (
                <div className={styles.sideList}>
                    {course.Collisions.map((collision: any, index: any) => {
                        return(
                            <div className={styles.collostion} key={index}>
                                <h3 onClick={() => handleCollostionList(index)}><ChevronDown style={openIndices.includes(index) ? {transform: 'rotate(90deg)'} : {transform: 'rotate(0deg)'}} /> التناظر اللفظي</h3>
                                <div className={styles.collostionList} style={{height: openIndices.includes(index) ? `${getHeight(collision)}px` : 0,marginBottom: openIndices.includes(index) ? '10px' : '0'}}>
                                    {collision.collisionGeneralLinks.length > 0 && (
                                        <div key={index} className={styles.collostionLinks}>
                                            <p>الروابط</p>
                                            <div className={styles.links}>
                                                {collision.collisionGeneralLinks.map((link: any, index: any) => {
                                                    return (
                                                        <Link target={'_blank'} href={link.link} key={index}><Link2/> <span>{link.linkTitle}</span></Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {collision.lessons.length > 0 && (
                                        <div className={styles.collostionLessons}>
                                            <p>الدروس</p>
                                            <div className={styles.lessons}>
                                                {collision.lessons.map((lesson: any, index: any) => {
                                                    if(blank){
                                                        return (
                                                            <Link target={!blank ? '_self' : '_blank'} href={`/course/${course._id}/${lesson._id}`} key={index}>{isLessonCompleted(lesson._id) ? <CheckCheck /> : <PlayCircle />} <span>{lesson.title}</span></Link>
                                                        )
                                                    }else{
                                                        return(
                                                            <button onClick={() => handleSelectedLessonChange(lesson._id)} key={index}>{isLessonCompleted(lesson._id) ? <CheckCheck /> : <PlayCircle />}<span>{lesson.title}</span></button>
                                                        )
                                                    }
                                                })}
                                            </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.sideList}>
                    {course.Collisions.map((collosionTitle: any, index: any) => {
                        return(
                            <div className={`${styles.collostion} ${styles.collostionLock}`} key={index}>
                                <h3><Lock /> {collosionTitle}</h3>
                            </div>
                        )
                    })}
                </div>
            )

            }
        </>
    )
}