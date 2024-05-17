"use client";

import { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import SideList from "./comps/SideList";
import LogoutSec from "./comps/sections/Logout";
import ProfileSection from "./comps/sections/Profile";
import Notifications from "./comps/sections/notifications";
import styles from './profile.module.scss';
import axios from "axios";
import FullPageLoading from "../components/ui/FullPageLoading";

export default function Profile() {
    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetch = async () =>{
          setLoading(true)
          try {
            const response:any = await axios.get('/api/account/')
            const data = response.data.data;
            setUserData(data)
            setLoading(false)
          }catch (error) {
            setUserData(null)
            setLoading(false)
          }
        }
        return () =>{
          fetch()
        }
      }, [])
    return(
        <main className={styles.main}>
            {!loading && <Header userData={userData}/>}
            <SideList/>
            <div className={styles.container}>
                {!loading && <ProfileSection userData_data={userData}/>}
                {!loading && <Notifications userData={userData}/>}
                <LogoutSec/>
            </div>
            <FullPageLoading loading={loading}/>
        </main>
    )
}