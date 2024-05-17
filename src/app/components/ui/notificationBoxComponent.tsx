"use client";
import { Bell, CheckCheck, RefreshCcw, ServerCrash, TriangleAlert } from 'lucide-react';
import styles from './notificationBox.module.scss'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
    title: string;
    description: string;
    time: string;
    date: string;
    seen: boolean;
    link: string;
    type: 'success' | 'update' | 'error' | 'warning';
}


const NotificationItem = ({ notification }: { notification: Notification, onClick: () => void }) => {
    return (
        <div className={styles.notificationItem} style={{ cursor: notification.link.length > 0 ? 'pointer' : 'default' }}>
            <div className={styles.icon}>
                {notification.type === 'success' && <CheckCheck style={{ backgroundColor: '#def2d6', color: '#5a7052' }} />}
                {notification.type === 'update' && <RefreshCcw style={{ backgroundColor: '#cde8f5', color: '#4480ae' }} />}
                {notification.type === 'error' && <ServerCrash style={{ backgroundColor: '#ecc8c5', color: '#b32f2d' }} />}
                {notification.type === 'warning' && <TriangleAlert style={{ backgroundColor: '#f8f3d6', color: '#967132' }} />}
            </div>
            <div className={styles.info}>
                <h3>{notification.title}</h3>
                <p>{notification.description}</p>
                <span>{notification.date} / {notification.time}</span>
            </div>
        </div>
    );
};


export function notificationBoxComponent({isOpen, notifications }: any) {
    return (
        <div id='notificationList' className={styles.notificationBox} style={{display: isOpen ? 'flex' : 'none'}}>
            <h2>
                <span>الاشعارات</span>
                <Bell />
            </h2>
            <div className={styles.notificationList} >
                {notifications.map((notification:any, index:any) => (
                    <NotificationItem
                        key={index}
                        notification={notification} 
                        onClick={function (): void {
                            throw new Error('Function not implemented.');
                        } }                    // onClick={() => handleNotiClick(notification)}
                    />
                ))}
            </div>
        </div>
    )
}             









export function ResponsieNotificationComponent({isOpen, notifications }: any) {
    return(
        <div style={{display: isOpen ? 'flex' : 'none'}} className={styles.RNotificationBox}>
            <div className={styles.RnotificationList}>
                {notifications.map((notification:any, index:any) => (
                    <NotificationItem
                        key={index}
                        notification={notification} 
                        onClick={function (): void {
                            throw new Error('Function not implemented.');
                        } }                    // onClick={() => handleNotiClick(notification)}
                    />
                ))}
            </div>
        </div>
    )
}