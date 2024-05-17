"use client"
import Link from 'next/link';
import styles from './footer.module.scss'
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedin, faWhatsapp, faXTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {

  const path:any = useRef(null);
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId:any = null;

  useEffect(() => {
    setPath(progress);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    setPath(progress); // Update path when screen is resized
  };

  const setPath = (progress:any) => {
    const width = window.innerWidth * 0.9;
    path.current.setAttributeNS(null, "d", `M0 250 Q${width * x} ${250 + progress}, ${width} 250`)
  }

  const lerp = (x:any, y:any, a:any) => x * (1 - a) + y * a

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId)
      resetAnimation()
    }
  }

  const manageMouseMove = (e:any) => {
    const { movementY, clientX } = e;
    const pathBound = path.current.getBoundingClientRect();
    x = (clientX - pathBound.left) / pathBound.width;
    progress += movementY
    setPath(progress);
  }

  const manageMouseLeave = () => {
    animateOut();
  }

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025);
    time += 0.2;
    setPath(newProgress);
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  }

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  }
  return (
    <div className={styles.container}>
        <div className={styles.body}>
            <div className={styles.line}>
              <div onMouseEnter={() => {manageMouseEnter()}} onMouseMove={(e) => {manageMouseMove(e)}} onMouseLeave={() => {manageMouseLeave()}} className={styles.box}></div>
              <svg>
                <path ref={path}></path>
              </svg>
            </div>
            <div className={styles.content}>
                <div className={styles.top}>
                   <div className={styles.aboutMeBox}>
                        <p>عني</p>
                        <h3>أنا شخص يتمتع بشغف كبير بمساعدة الآخرين على تحقيق أهدافهم التعليمية وتطوير مهاراتهم. بفضل خبرتي وشهاداتي المعتمدة في تدريس قدرات التأسيس واللغة الإنجليزية، أسعى دائمًا إلى توجيه الطلاب نحو النجاح وتعزيز ثقتهم في قدراتهم. أؤمن بأهمية بناء علاقات تعليمية قوية مع الطلاب، وتكييف الدروس لتلبية احتياجاتهم الفردية. باعتباري مدرسًا ملتزمًا بالتميز والتطوير المستمر، فإنني أسعى جاهدًا لتقديم بيئة تعليمية داعمة ومحفزة تسهم في تحقيق نتائج إيجابية ومستدامة للطلاب. </h3>
                   </div>
                   <div className={styles.linksBox}>
                        <p>الصفحات</p>
                        <div>
                            <Link href={'/'}>الرئيسية</Link>
                            <Link href={'/courses'}>الدورات </Link>
                            <Link href={'/about'}>عني </Link>
                            <Link href={'/contact'}>تواصل معي </Link>
                            <Link href={'/blog'}>خطوات التسجيل </Link>
                            <Link href={'/privacy'}>سياسية الخصوصية </Link>
                            <Link href={'/terms'}>الشروط والاحكام</Link>
                        </div>
                   </div>
                   <div className={styles.socialsBox}>
                        <p>التواصل الاجتماعي</p>
                        <div>
                          <Link href={'/'} title='Facebook'><FontAwesomeIcon icon={faFacebookF}/></Link>
                          <Link href={'/'} title='Whatsapp'><FontAwesomeIcon icon={faWhatsapp}/></Link>
                          <Link href={'/'} title='Twitter'><FontAwesomeIcon icon={faXTwitter}/></Link>
                          <Link href={'/'} title='Linkedin'><FontAwesomeIcon icon={faLinkedin}/></Link>
                        </div>
                   </div>
                </div>
                <div className={styles.bottom}>
                    <p>جميع الحقوق محفوظة لدى vertas © 2024</p>
                    <div>
                        <Link href={'/privacy'}>سياسة الخصوصية</Link>
                        <span>•</span>
                        <Link href={'/terms'}>الشروط والاحكام</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
