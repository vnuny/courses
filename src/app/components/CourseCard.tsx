"use client";

import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import styles from './style.module.scss'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Cookies from "js-cookie";
const courseComponent = ({title, img, desc, price,date,orderedCount,rating,id,owned,progress}:{
    title: string,
    img: string,
    desc: string,
    price: string,
    date: string,
    orderedCount: number,
    rating: number,
    owned: Boolean,
    id: number,
    progress: number
}) => {
    const router = useRouter();
    const roundedRating = Math.round(rating);
    const renderStars = (rating: number) => {
        const maxStars = 5;
        const stars = [];
        const numStars = Math.min(maxStars, roundedRating);

        for (let i = 0; i < numStars; i++) {
            stars.push(<Star key={i} />);
        }
        return stars;
    };
    const handleCardClick = (e:any) => {
        const buy = document.getElementById('buy');
        if(e.target === buy) {
            if(Cookies.get('token')){
                router.push(`/checkout/${id}`)
            }else{
                router.push('/account/login')
            }
        }else{
            router.push(`/course/${id}`)
        }
    }
    return (
        <div className={styles.courseCard} onClick={handleCardClick} key={id}>
            <div className={styles.poster}>
                <img src={img} alt={title} />
            </div>
            <div className={styles.info}>
                <div className={styles.topDetails}>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                </div>
                {owned === true ? (
                    <div className={styles.bottomDetails_owend}>
                        <div className={styles.slider}><span style={{width: `${progress}%`}}></span></div>
                        <div className={styles.bottom}>
                            <h3>{progress}%</h3>
                            <p>تم الانتهاء بنسبة</p>
                        </div>
                    </div>
                ) : (
                    <div className={styles.bottomDetails}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                            <h3>${price}</h3>
                            <div className={styles.raitingBox}>
                                <span>({orderedCount})</span>
                                <div className={styles.stars}>
                                    {renderStars(Math.round(rating))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.btns}>
                            <button id='buy'><ChevronLeft /> شراء الان</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default courseComponent;