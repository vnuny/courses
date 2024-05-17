"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from '../style.module.scss'
import axios from "axios";
import Link from "next/link";
import Header from "@/app/components/ui/Header";
import { X } from "lucide-react";
export default function SignUp() {
  const router = useRouter();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        passwordRepeat: "",
    })
    const [successMessage, setSuccessMessage] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
      general: "",
      name: "",
      email: "",
      password: "",
      passwordRepeat: ""
    });
    const [openGender, setOpenGender] = useState(false);
    const [isLoading, setIsLoading] = useState(
      <><i className="fa-solid fa-angle-left"></i>إنشاء حساب</>
    );
    const handleGender = () => {
      setOpenGender(!openGender);
    };

  const validateForm = () => {
    let isValid = true;
    const errors = {name: "",email: "", password: "", passwordRepeat: ""};
    if (data.name.trim() === "") {
      errors.name = "الرجاء إدخال الاسم";
      isValid = false;
    }else if(data.name.length < 3){
      errors.name = "الاسم يجب أن يكون على الأقل 3 حروف";
      isValid = false;
    }
    if (data.email.trim() === "") {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
      isValid = false;
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)){
      errors.email = "الرجاء إدخال بريد الكتروني صالح";
      isValid = false;
    }
    if (data.password.trim() === "") {
      errors.password = "الرجاء إدخال كلمة المرور";
      isValid = false;
    }else if(data.password.length < 8){
      errors.password = "كلمة المرور يجب أن تكون على الأقل 8 حروف";
      isValid = false;
    }
    if (data.passwordRepeat.trim() === "") {
      errors.passwordRepeat = "الرجاء تأكيد كلمة المرور";
      isValid = false;
    }
    if (data.password.trim() !== data.passwordRepeat.trim()) {
      errors.passwordRepeat = "كلمة المرور غير متطابقة";
      isValid = false;
    }

    setErrorMessage(prevState => ({ ...prevState, ...errors }));
    return isValid;
  };
  const submit = async (e:any) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setBtnDisabled(true);
    setIsLoading(<><i className="fa-solid fa-spinner fa-spin"></i>جاري التحقق</>)

    try {
        const res = await axios.post("/api/account/signup", {name: data.name, email: data.email, password: data.password});
        console.log(res);
        if(res.status === 200){
          router.push('/account/signup/validation');
        }
    } catch (error:any) {
        setBtnDisabled(false);
        setIsLoading(<><i className="fa-solid fa-angle-left"></i>إنشاء حساب</>)
        if(error.response.status === 400){
            setErrorMessage({ ...errorMessage, general: error.response.data.message });
        }else {
            setErrorMessage({ ...errorMessage, general: error.response.data.message });
        }
        console.log(error.response.status);
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
                <h2>انشاء حساب جديد</h2>
            {errorMessage.general && (
            <div style={{
              display: 'flex',
              flexDirection: 'row-reverse',
            }} className={styles.SignUpError}>
                <X style={{
                  cursor: 'pointer',
                }} onClick={() => clearError("general")}/>
            {errorMessage.general}
            </div>
            )}
            {errorMessage.name && (
                <div className={styles.errorMessage} style={{color: 'var(--red)'}}>{errorMessage.name}</div>
            )}
            <input
                placeholder="الاسم"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                style={{
                border: errorMessage.name && "1px solid var(--red)",
                }}
            />
            {errorMessage.email && (
                <div style={{color: 'var(--red)'}} className={styles.errorMessage}>{errorMessage.email}</div>
            )}
            <input
                placeholder="البريد الإلكتروني"
                onChange={(e) => setData({ ...data, email: e.target.value })}
                style={{
                border: errorMessage.email && "1px solid var(--red)",
                }}
            />
            {errorMessage.password  && (
                <div style={{color: 'var(--red)'}} className={styles.errorMessage}>{errorMessage.password}</div>
            )}
            <input
                placeholder="كلمة المرور"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                style={{
                border: errorMessage.password && "1px solid var(--red)",
                }}
            />
            {errorMessage.passwordRepeat && (
                <div style={{color: 'var(--red)'}} className={styles.errorMessage}>{errorMessage.passwordRepeat}</div>
            )}
            <input
                placeholder="تأكيد كلمة المرور"
                onChange={(e) => setData({ ...data, passwordRepeat: e.target.value })}
                style={{
                border: errorMessage.password && "1px solid var(--red)",
                }}
            />
            <button disabled={btnDisabled} style={{paddingLeft: btnDisabled ? "20px" : "25px"}} type="submit">{isLoading}</button>
            <p style={{
                textAlign: "center",
                marginTop: "20px",
                color: "var(--txt)",
            }}>لديك حساب؟ <Link style={{
                color: "var(--primary)",
            }} href="/account/login">تسجيل الدخول</Link></p>
            </form>
        </div>
    </main>
  );
}