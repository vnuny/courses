"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from '../style.module.scss'
import axios from "axios";
import Link from "next/link";
import Header from "@/app/components/ui/Header";
export default function SignUp() {
  const router = useRouter();
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [successMessage, setSuccessMessage] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
      general: "",
      email: "",
      password: "",
    });
    const [openGender, setOpenGender] = useState(false);
    const [isLoading, setIsLoading] = useState(
      <><i className="fa-solid fa-angle-left"></i>إنشاء حساب</>
    );

  const validateForm = () => {
    let isValid = true;
    const errors = {email: "",password: ""};
    if (data.email.trim() === "") {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
      isValid = false;
    }
    if (data.password.trim() === "") {
      errors.password = "الرجاء إدخال كلمة المرور";
      isValid = false;
    }
    setErrorMessage(prevState => ({ ...prevState, ...errors }));
    return isValid;
  };
  const submit = async (e:any) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }else{
      setErrorMessage({ ...errorMessage, general: "", email: "", password: "" });
    }
    try {
      setIsLoading(<i className="fa-solid fa-spinner fa-spin"></i>);
      setBtnDisabled(true);
      const res = await axios.post("/api/account/login", data);
      console.log(res);
      if(res.status === 200){
        router.push('/');
      }else if(res.status === 400){
        setBtnDisabled(false);
        setErrorMessage({ ...errorMessage, general: res.data.message });
      }
    } catch (error:any) {
      setBtnDisabled(false);
      if(error.response.status === 400){
        setErrorMessage({ ...errorMessage, general: error.response.data.message });
      }else{
        setErrorMessage({ ...errorMessage, general: "حدث خطأ ما" });
      }
    }finally{
      setIsLoading(<><i className="fa-solid fa-angle-left"></i>تسجيل الدخول</>);
      setBtnDisabled(false);
    }
  };
  const clearError = (field:any) => {
    setErrorMessage((prevState) => ({ ...prevState, [field]: "" }));
  };
  return (
    <main>
      <Header />
        <div className={styles.SignUpMain}  >
            <form onSubmit={submit} dir="rtl">
                <h2>تسجيل الدخول</h2>
            {errorMessage.general && (
            <div className={styles.SignUpError} dir="rtl">
            {errorMessage.general}
                <i className="fa-regular fa-xmark" onClick={() => clearError("general")}></i>
            </div>
            )}
            {errorMessage.email && (
                <div className={styles.errorMessage}>{errorMessage.email}</div>
            )}
            <input
                placeholder="البريد الإلكتروني"
                onChange={(e) => setData({ ...data, email: e.target.value })}
                style={{
                border: errorMessage.email && "1px solid var(--red)",
                }}
            />
            {errorMessage.password && (
                <div className={styles.errorMessage}>{errorMessage.password}</div>
            )}
            <input
                placeholder="كلمة المرور"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                style={{
                border: errorMessage.password && "1px solid var(--red)",
                }}
            />
            <Link href="/account/login/forgot-password" style={{
              color: "var(--txt)",
              marginBottom: '25px',
              fontSize: "0.9em"
            }}>نسيت كلمة المرور؟</Link>
            <button disabled={btnDisabled} style={{paddingLeft: btnDisabled ? "20px" : "25px"}} type="submit">{isLoading}</button>
            <p style={{
                textAlign: "center",
                marginTop: "20px",
                color: "var(--txt)",
                fontSize: "0.9em"
            }}> ليس لديك حساب ؟<Link style={{
                color: "var(--primary)",
                marginRight: "5px"
            }} href="/account/signup">انشاء حساب</Link></p>
            </form>
        </div>
    </main>
  );
}