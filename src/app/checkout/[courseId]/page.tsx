"use client";
import Link from 'next/link';
import styles from '../style.module.scss'
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
export default function Page({params}:any) {
    const [courseData, setCourseData] = useState<any>({});
    const [loading,setLoading] = useState(false);
    const route = useRouter();
    const [totalPrice, setTotalPrice] = useState(0);

    const [discountMount, setDiscountMount] = useState(0);
    const [discountCode, setDiscountCode] = useState<any>('');
    const [isCodeValid, setIsCodeValid] = useState(true);


    const redirectToUrl = (url:any) => {
        route.push(url);
    };
    const submit = async () =>{
        setLoading(true);
        try {
            const response = await axios.post('/api/checkout',{
                title: courseData.title,
                generalDesc: courseData.generalDesc,
                price: courseData.price,
                courseId: params.courseId,
                discountCode: isCodeValid ? discountCode : null
            });
            console.log(response);
            setLoading(false);
            if(response.status === 200){
                setLoading(true);
                route.push(response.data.url);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await axios.post('/api/course-details',{course_id: params.courseId})
                setCourseData(response.data.course)
                setTotalPrice(response.data.course.price)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }
        return () => {
            fetch()
        }
    }, [])
    
    const handleCodeValidation = async (e:any) => {
        setDiscountCode(e.target.value)
        function calculateDiscountedPrice(originalPrice:any, discountPercentage:any) {
            if (discountPercentage < 0 || discountPercentage > 100) {
                throw new Error('Discount percentage must be between 0% and 100%.');
            }
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;
            return discountedPrice;
        }
        try {
            const response = await axios.get('/api/discount-code',{params:{code: e.target.value}})
            const discountPercent = response.data.dbCode?.discountMount;
            setDiscountMount((courseData.price -  
                +calculateDiscountedPrice(courseData.price, discountPercent)));
            setTotalPrice((calculateDiscountedPrice(courseData.price, discountPercent)));
            console.log(response.data)
            setIsCodeValid(true);
        } catch (error) {
            setIsCodeValid(false);
            setDiscountMount(0);
            setTotalPrice(courseData.price);
            console.log(error)
        }
    }

    return(
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>checkout page</h1>
                <Link href={'/'}>back <ChevronLeft /></Link>
            </header>
            <div className={styles.content}>
                <div className={styles.bill}>
                    <h2 className={styles.title}>فاتورة الشراء</h2>
                    <h3 className={styles.secondTitle}>العناصر المشتراه</h3>
                    <div className={styles.productBillCard}>
                        <div className={styles.productPoster}>
                            <img src={courseData?.img} alt={courseData?.title} />
                        </div>
                        <h3>{courseData?.title}</h3>
                    </div>
                     <div className={styles.offerCodeBox}>
                        <h3 className={styles.secondTitle}>كود الخصم</h3>
                        <div className={styles.offerCodeInput}>
                            <input style={{borderColor : discountCode ? (isCodeValid ? 'green' : 'red') : 'var(--border)'}} type="text" onChange={handleCodeValidation} placeholder="الرجاء ادخال كود الخصم" />
                        </div>
                     </div>
                    <div className={styles.finalPrices}>
                        <h3 className={styles.secondTitle}>الاجمالي</h3>
                        <div className={styles.prices}>
                            <div className={styles.lightColor}>
                                <h3>سعر الدورة</h3>
                                <h3>{courseData?.price}$</h3>
                            </div>
                            {
                                discountCode.length > 0 && <div className={styles.lightColor}>
                                <h3>الخصم</h3>
                                <h3>{discountMount}$</h3>
                            </div>
                            }
                            <div>
                                <h3>الاجمالي</h3>
                                <h3>{totalPrice}$</h3>
                            </div>
                        </div>
                    </div>
                    <div className={styles.btns}>
                        <button onClick={submit}>{loading ? 'جاري التحميل...' : 'تاكيد الطلب'}</button>
                        <Link href={'/'}>الغاء الطلب</Link>
                    </div>
                </div>
                <div className={styles.product}>
                    <div className={styles.top}> 
                        <div className={styles.productPoster}>
                            <img src={courseData?.img} alt="" />
                        </div>
                        <div className={styles.productInfo}>
                            <h2>{courseData?.title}</h2>
                            <h3>{courseData?.generalDesc}</h3>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        
                    </div>
                </div>
            </div>
        </main>
    )
}