"use client";

import Link from "next/link";
import Image from "next/image";
import styles from './style.module.scss'
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import { Bell, ChevronLeft, ShoppingCart } from 'lucide-react';
import axios from "axios";
import jscookie from 'js-cookie'
import { buffer } from "stream/consumers";
import { useScrollLock } from "@/app/hooks/scrollLock";
import {notificationBoxComponent, ResponsieNotificationComponent } from "./notificationBoxComponent";
import React from "react";
export default function Header({userData}: any) {
    const [userdata, setUserData] = useState({
        username: '',
        joinedAt: '',
        profilePicBuffer: '',
        _id: '',
    })
    const [notifications, setNotifications]:any = useState([]);
    const [notificationCount, SetnotificationCount] = useState(0);
    const [listOpen, setListOpen] = useState(false);
    const [isLoginIn, setIsLoginIn] = useState(false);
    useEffect(()=>{
        const fetch = async ()=>{
            if(userData){
                setUserData({
                    username: userData.name,
                    joinedAt: userData.joinedAt,
                    profilePicBuffer: userData.profilePicBuffer,
                    _id: userData._id
                })
                const notSeenNotifications = userData.notifications.filter((notification: any) => !notification.seen);
                SetnotificationCount(notSeenNotifications.length)
                setNotifications(userData.notifications)
                setIsLoginIn(true)
            }else{
                setIsLoginIn(false)
            }
        }
        return () => {
            fetch();
        }
    },[])
    const logout = async ()=>{
        jscookie.remove('token');
        jscookie.remove('tempToken');
        setUserData({
            username: '',
            joinedAt: '',
            profilePicBuffer: '',
            _id: ''
        })
        setIsLoginIn(false)
    }
    const [notificationListOpen, setNotificationListOpen] = useState(false);
    const handleNotificationListOpen = async () => {
        if(notificationListOpen) {
            setNotificationListOpen(false);
        } else {
            setNotificationListOpen(true);
        }
        try {
            const response = await axios.post('/api/notification');
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

    }
    const openNotificationListButton:any = useRef(null);
    const responseiveList:any = useRef(null)
    const responseListBtn:any = useRef(null)
    useEffect(() => {
        const notificationList = document.getElementById('notificationList');

        document.addEventListener('click', (e:any) => {
            if (notificationList && !notificationList?.contains(e.target) && !openNotificationListButton?.current?.contains(e.target)) {
                setNotificationListOpen(false);
                console.log('clicked outside');
            }

            if(responseiveList.current && !responseiveList?.current?.contains(e.target) && !responseListBtn?.current?.contains(e.target)) {
                setListOpen(false);
            }
        })
        return () => {
            document.removeEventListener('click', (e) => {
                // console.log(notificationBoxRef)
            })
        }
    },[])


    const [responsiveNotificationList, setResponsiveNotificationList] = useState(false);
    const handleResponsiveNotificationListOpen =  async () => {
        
        if(responsiveNotificationList) {
            setResponsiveNotificationList(false);
        } else {
            setResponsiveNotificationList(true);
        }
        try {
            const response = await axios.post('/api/notification');
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <header className={styles.header}>
            <div className={styles.right}>
                <Link className={styles.logo} href="/" >على</Link>
                <nav className={styles.navigation}>
                    <Link href={'/'}>الصفحة الرئيسية</Link>
                    <Link href={'/about'}>عني</Link>
                    <Link href={'/contact'}>تواصل معنا</Link>
                    <Link href={'/blog'}>خطوات التسجيل</Link>
                </nav>
            </div>
            <div className={styles.account}>
                {
                    isLoginIn ? (
                        <div className={styles.accountBox}>
                            <Link href={'/profile'}>
                                حسابي
                                <img src={userdata.profilePicBuffer.length > 0 ? `/api/profilepic?userId=${userdata._id}`: 'https://i.pinimg.com/736x/90/de/25/90de257fdac14d35d66a81ab8e282cad.jpg'} alt={'profile pic'} width={30} height={30} />
                            </Link>
                            <Link ref={openNotificationListButton} onClick={handleNotificationListOpen} style={{marginLeft: '10px'}} className={styles.cart} href={''} >
                                <Bell />
                                {notificationCount > 0 && <span>{(notificationCount > 99 ? '99+' : notificationCount)}</span>}
                                
                            </Link>
                        </div>
                    ):
                    (
                        <>
                            <Link href={'/account/login'}>تسجيل الدخول</Link>
                            <Link href={'/account/signup'}>تسجيل</Link>
                        </>
                    )
                }
                {
                    notificationBoxComponent({isOpen: notificationListOpen, notifications: notifications})
                }
                <label ref={responseListBtn} className={styles.hamburger}>
                    <input type="checkbox" checked={listOpen} onChange={(e:any)=>setListOpen(e.target.checked)}/>
                    <svg viewBox="0 0 32 32">
                        <path className={`${styles.line} ${styles.lineTopBottom}`} d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                        <path className={styles.line} d="M7 16 27 16"></path>
                    </svg>
                </label>
            </div>
            <div ref={responseiveList} className={styles.list} style={{height: (isLoginIn ? (listOpen ? (responsiveNotificationList ? '620px' : '395px') : '0px') : (listOpen ? '325px' : '0px')), opacity: listOpen ? 1 : 0}}>
                {isLoginIn &&<div className={styles.accountBox} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}> 
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div className={styles.btnsHolder}>
                            <div onClick={handleResponsiveNotificationListOpen} className={styles.notificationBox}>
                                <Bell />
                                {notificationCount > 0 && <span>{(notificationCount > 99 ? '99+' : notificationCount)}</span>}
                            </div>
                        </div>
                        <div className={styles.accountInfo}>
                            <div>
                                <h3>مرحبا {userdata.username}</h3>
                                <p>نورتنا في {userdata.joinedAt}</p>
                            </div>
                            <img src={userdata.profilePicBuffer.length > 0 ? `/api/profilepic?userId=${userdata._id}`: 'https://i.pinimg.com/736x/90/de/25/90de257fdac14d35d66a81ab8e282cad.jpg'} width={50} height={50} alt="" />
                        </div>
                    </div>
                    <ResponsieNotificationComponent isOpen={responsiveNotificationList} notifications={notifications}/>
                </div>}
                <div className={styles.listNavigation}>
                    <Link href="/"><ChevronLeft /> الصفحة الرئيسية</Link>
                    <Link href="/about"><ChevronLeft /> من نحن</Link>
                    <Link href="/contact"><ChevronLeft /> تواصل معنا</Link>
                    {isLoginIn? (
                        <>
                            <Link href="/account/profile"><ChevronLeft />كورساتي</Link>
                            <Link onClick={logout} href="/" style={{color: 'var(--red)'}} onMouseEnter={(e:any)=>{e.target.style.outline = '1px solid var(--red)'}}  onMouseLeave={(e:any)=>{e.target.style.outline = 'none'}}><ChevronLeft />تسجيل خروج</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/account/login"><ChevronLeft /> تسجيل الدخول</Link>
                            <Link onMouseEnter={(e:any)=>{e.target.style.outline = '1px solid var(--txtH)'}}  onMouseLeave={(e:any)=>{e.target.style.outline = 'none'}}  href="/account/signup"><ChevronLeft /> انشاء حساب</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
