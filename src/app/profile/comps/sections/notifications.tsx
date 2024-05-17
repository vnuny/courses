"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCheck, CircleX } from "lucide-react";
import styles from './style.module.scss';

export default function Notifications({userData}: any) {
    const [statics, setStatics] = useState({
        update_courses_notifications: false,
        enable_offers_notifications: false,
    });
    const [error, setError] = useState('');
    useEffect(() => {
        async function fetchNotificationSettings() {
            try {
                setStatics(userData);
            } catch (error) {
                console.log('Error fetching notification settings:', error);
            }
        }
        fetchNotificationSettings();
    }, []);

    const showToastMessage = (message:any) => {
        setError(message);
        setTimeout(() => {
          setError('');
        }, 5000);
      };

    const handleCheckboxChange = async (key:any, value:any) => {
        setStatics((prev) => ({ ...prev, [key]: value }));

        try {
            const response = await axios.post('/api/account/notification', {
                ...statics,
                [key]: value,
            });
        } catch (error) {
            console.log('Error updating notification settings:', error);
            showToastMessage('حدث خطأ ما')
            setStatics((prev) => ({ ...prev, [key]: !value }));
        }
    };

    return (
        <div className={styles.notificationsWrapper} id="notification">
            <div className={styles.blockHeader}>
                <h2 className={styles.title}>الاشعارات</h2>
                {error.length > 0 && <div style={{borderColor: 'var(--red)'}} className={styles.notificationBox}>
                    <h3>{error}</h3>
                    <div className={styles.icon}>
                        <CircleX color='var(--red)' />
                    </div>
                </div>}
            </div>
            <div className={styles.content}>
                <div className={styles.checkBoxBox}>
                    <h3>تلقي تحديثات الدورات</h3>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={statics.update_courses_notifications}
                            onChange={(e) =>
                                handleCheckboxChange('update_courses_notifications', e.target.checked)
                            }
                        />
                        <div className={styles.toggleSwitchBackground}>
                            <div className={styles.toggleSwitchHandle}></div>
                        </div>
                    </label>
                </div>
                <div className={styles.checkBoxBox}>
                    <h3>تلقى احدث العروض وكربونات الخصم</h3>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={statics.enable_offers_notifications}
                            onChange={(e) =>
                                handleCheckboxChange('enable_offers_notifications', e.target.checked)
                            }
                        />
                        <div className={styles.toggleSwitchBackground}>
                            <div className={styles.toggleSwitchHandle}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
