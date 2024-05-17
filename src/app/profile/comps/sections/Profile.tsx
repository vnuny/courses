"use client";
import { Camera, CheckCheck, CircleCheck, CircleX, Image, Info, Loader, Save, X } from 'lucide-react';
import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useScrollLock } from '@/app/hooks/scrollLock';
import React from 'react';


export default function ProfileSection({userData_data}:any) {
    const [staticUserData, setStaticUserData]:any = useState({
        username: '',
        joinedAt: '',
        email: '',
        phoneNumber: '',
        bio: '',
        profilePicBuffer: '',
        _id: ''
    })
    const [userData, setUserData]:any = useState({
        username: '',
        joinedAt: '',
        email: '',
        phoneNumber: '',
        bio: '',
        profilePicBuffer: '',
        _id: ''
    })
    const [uploadListOpen, setUploadListOpen] = useState(false);
    const { lockScroll, unlockScroll } = useScrollLock();
   useEffect(() => {
     if (uploadListOpen) {
       lockScroll();
     } else {
       unlockScroll();
     }
   }, [uploadListOpen])
  
    useEffect(()=>{
        const fetch = async ()=>{
                const data = userData_data;
                setUserData({
                    username: data.name,
                    profilePicBuffer: data.profilePicBuffer,
                    joinedAt: data.joinedAt,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    bio: data.bio,
                    _id: data._id
                })
                setStaticUserData({
                    username: data.name,
                    profilePicBuffer: data.profilePicBuffer,
                    joinedAt: data.joinedAt,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    bio: data.bio,
                    _id: data._id
                })
        }
        return () => {
            fetch()
        }
    },[])
    const InputRef:any = useRef(null)
    const handleBoxClick = () => {
        InputRef.current.click();
    };

    const uploadBoxRef:any = useRef(null);
    const handleUploadBoxClose = (e:any) => {
        console.log(e.target)
        if(e.target !== uploadBoxRef.current && e.target !== InputRef.current) {
            setUploadListOpen(false)
        }
    }

    const [uploadedAvatar, setUploadedAvatar]:any = useState('')
    const handleDrop = async (event:any) => {
        event.preventDefault();
        const refresh = async ()=>{
            try {
                const response:any = await axios.get('/api/account/')
                const data = response.data.data;
                setUserData({
                    username: data.name,
                    profilePicBuffer: data.profilePicBuffer,
                    joinedAt: data.joinedAt,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    bio: data.bio,
                    _id: data._id
                })
                setStaticUserData({
                    username: data.name,
                    profilePicBuffer: data.profilePicBuffer,
                    joinedAt: data.joinedAt,
                    email: data.email,
                    phoneNumber: '',
                    bio: data.bio,
                    _id: data._id
                })
            } catch (error) {

            } finally {
                
            }
        }
        if(event.target !== InputRef.current) {
            const file = event.dataTransfer.files[0];

            if (file.type.startsWith('image/')) {
                const formData = new FormData();
                formData.set('avatar', file);
                
                try {
                    const response = await fetch('/api/account/change-avatar', {
                        method: 'POST',
                        body: formData
                    });

                    console.log(response.status);
                    
                    if (response.status === 200) {
                        refresh();
                        setUploadListOpen(false);
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('Uploaded file is not an image.');
            }
        } else {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.set('avatar', file);
            try {
                const response = await fetch('/api/account/change-avatar', {
                    method: 'POST',
                    body: formData
                })
                console.log(response.status);
                if(response.status === 200) {
                    refresh()
                    setUploadListOpen(false)
                }
            } catch (error) {
                console.log(error)
            }
        }

    };    
    const [saveBtnDisabled, setSaveBtnDisabled] = useState(true)
    const [saveBtnLoading, setSaveBtnLoading] = useState(false)
    const [toastMessage, setToastMessage] = useState({
        visible: false,
        type: 'success',
        message: 'تم حفظ الملف الشخصي',
    })

    useEffect(() => {
        if(userData.username !== staticUserData.username || userData.email !== staticUserData.email || userData.phoneNumber !== staticUserData.phoneNumber || userData.bio !== staticUserData.bio) {
            setSaveBtnDisabled(false)
        }else{
            setSaveBtnDisabled(true)
        }
    },[userData])

    const [validationErrors, setValidationErrors] = useState({
        username: 'اقصى طول 20 حرف',
        bio: '',
        phoneNumber: '',
    })
    
    const showToastMessage = (type:any, message:any) => {
        setToastMessage({
          visible: true,
          type: type,
          message: message,
        });
    
        setTimeout(() => {
          setToastMessage((prev) => ({
            ...prev,
            visible: false,
          }));
        }, 5000);
      };
    
      const handleSubmit = async () => {
        setSaveBtnLoading(true);
        try {
          const response = await axios.post('/api/account', userData);
          showToastMessage('success', 'تم تحديث الملف الشخصي بنجاح');
          setSaveBtnLoading(false);
          setSaveBtnDisabled(true);
          console.log(response);
        } catch (error) {
          showToastMessage('error', 'حدث خطأ ما، الرجاء المحاولة لاحقاً');
          setSaveBtnLoading(false);
          console.log(error);
        }
      };
    return (
        <div className={styles.profileWrapper} id='profile'>
            <div className={styles.blockHeader}>
                <h2 className={styles.title}>الملف الشخصي</h2>
                {
                    toastMessage.visible ? (
                        <div className={styles.notificationBox} style={{borderColor : toastMessage.type === 'success' ? 'green' : 'var(--red)'}}>
                            <h3>{toastMessage.message}</h3>
                            <div className={styles.icon}>
                                {toastMessage.type === 'success' ? <CheckCheck color='green' /> : <CircleX color='var(--red)' />}
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <div className={styles.content}>
                <div className={styles.profilePic}>
                    <div className={styles.profileImage} onClick={()=>{setUploadListOpen(true)}}>
                        <div className={styles.overlay}>
                            <Camera />
                        </div>
                        <img src={userData.profilePicBuffer.length > 0 ? `/api/profilepic?userId=${userData._id}`: 'https://i.pinimg.com/736x/90/de/25/90de257fdac14d35d66a81ab8e282cad.jpg'} alt="profile picture" />
                    </div>
                    <h3>مرحبا, vnun</h3>
                </div>
                <div className={styles.inputBox}>
                    <h3>الاسم</h3>
                    <input dir={userData.username.includes('ا') || userData.username.includes('ي') || userData.username.includes('و') || userData.username.includes('ى') ? 'rtl' : 'ltr'} maxLength={40} onChange={(e) => setUserData({ ...userData, username: e.target.value })} type="text" value={userData.username} />
                </div>
                <div className={`${styles.inputBox} ${styles.bioBox}`}>
                    <h3>السيرة الذاتية</h3>
                    <textarea maxLength={400} onChange={(e) => setUserData({ ...userData, bio: e.target.value })} dir={userData.bio.includes('ا') || userData.bio.includes('ي') || userData.bio.includes('و') || userData.bio.includes('ى') ? 'rtl' : 'ltr'} value={userData.bio} />
                </div>
                <div className={styles.inputBox}>
                    <h3>رقم الهاتف</h3>
                    <input onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                        setUserData({ ...userData, phoneNumber: numericValue });
                    }} type="text" pattern="\d*" maxLength={15} dir='ltr' value={userData.phoneNumber} />
                </div>
                <div className={styles.inputBox}>
                    <h3>البريد الالكتروني</h3>
                    <input dir='ltr' disabled type="text" value={userData.email} />
                </div>
                <div className={styles.inputBox}>
                    <h3>تاريخ الانضمام</h3>
                    <input dir='ltr' type="text" disabled value={userData.joinedAt} />
                </div>
                <button disabled={saveBtnDisabled} className={saveBtnLoading ? styles.saveBtnLoading : ''} onClick={handleSubmit}>
                     {
                        saveBtnLoading ? (<Loader />) : (<><h3>حفظ</h3><Save/></>)
                     }
                </button>
            </div>
            <div onClick={handleUploadBoxClose} className={styles.uploadAvatarBox} style={{
                display: uploadListOpen ? 'flex' : 'none'
            }}>
                <div className={styles.close}>
                    <button onClick={()=>{setUploadListOpen(false)}}>
                        <X />
                        <h3>الغاء</h3>
                    </button>
                </div>
                <div ref={uploadBoxRef}
                 onDragOver={(e:any)=>{e.preventDefault()}} // Call handleDragOver when dragging over the div
                 onDrop={handleDrop}
                 className={styles.box} onClick={handleBoxClick}>
                <input
                    ref={InputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleDrop}
                    accept="image/jpeg, image/png"
                />
                    <div className={styles.icon}>
                        <Image />
                    </div>
                    <h3>انقر للتحميل او اسحب الصورة الي هنا</h3>
                    <p>اقصى حجم للصورة 800kb</p>
                </div>
                
            </div>
        </div>
    )
}