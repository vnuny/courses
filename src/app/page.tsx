"use client";

import { useEffect, useState } from "react";
import Header from "./components/ui/Header";
import HeroSection from "./pagesComponents/Home/HeroSection";
import CoursesSection from "./pagesComponents/coursesSection/coursesSection";
import Footer from "./components/ui/Footer";
import axios from "axios";
import FullPageLoading from "./components/ui/FullPageLoading";

export default function Home() {
  const [userData, setUserData]:any = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () =>{
      setLoading(true)
      try {
        const response:any = await axios.get('/api/account/')
        const data = response.data.data;
        console.log(data)
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
  
  return (
    <main dir="rtl">
      <div style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {!loading? (<Header userData={userData} />) : null}
        <HeroSection />
        <CoursesSection/>
        <Footer/>
      </div>
      <FullPageLoading loading={loading}/>
    </main>
  )
}