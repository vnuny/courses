import connectDB from "@/dbconfig/connect";
import Courses from "@/model/coursesModel";
import { NextResponse } from "next/server";




const course = {
    title: 'دورة تأسيس قدرات لفظي',
    generalDesc: 'دورة قدرات لفظي هي برنامج تعليمي يستهدف تطوير وتحسين مهارات الفهم اللغوي واللفظي لدى المشاركين، خاصةً فيما يتعلق بالقراءة والاستيعاب وفهم النصوص، وزيادة ثراء المفردات والقدرة على التعبير بوضوح ودقة.',
    rating: 4.5,
    price: '20.77',
    date: '10/5/2024',
    img: 'https://i.ytimg.com/vi/SEiCvrnMsRg/maxresdefault.jpg',
    courseAdvantages: [
        'جميع ما تحتاجه لتتأسس في التناظر اللفظي',
        'شرح مبسط وسهل الفهم لجميع فئات المشاركين',
        'منهج منظم ومتكامل لتحسين مهارات المشاركين',
    ],
    orderedCount: 0, 
    Collisions: [
        {
            collisionsTitle: 'التناظر اللفظي',
            collisionGeneralLinks: [
                {
                    linkTitle: 'ملف التناظر اللفظي',
                    link: 'https://drive.google.com/file/d/1kG8cA6pViNVxAnZlpEv816wiSptYHZXw/view'
                }
            ],
            lessons: [
                {
                    title: 'الحصه الاولى',
                    desc: 'الحصه الاولى في شرح التناظر اللفظي',
                    videoUrl: 'https://player.vimeo.com/video/945477234?h=a4f9c949c6',
                    lessonIndex: 0,
                    links: [
                        {
                            linkTitle: 'ملف عشوائي',
                            link: 'https://drive.google.com/file/d/1zF04AUtUlbP1CT88FDubDt61gv-PqcFm/view'
                        }
                    ]
                },
                {
                    title: 'الحصه الثانيه',
                    desc: 'الحصه الثانيه في شرح التناظر اللفظي',
                    lessonIndex: 1,
                    videoUrl: 'https://player.vimeo.com/video/945479006?h=a1aecb08de'
                }
            ] 
        },{
            collisionsTitle: 'اكمال الجمل',
            collisionGeneralLinks: [
                {
                    linkTitle: 'ملف شرح اكمال الجمل',
                    link: 'https://drive.google.com/file/d/1ygDkjKHZVFaH_mifYslV25FuYMVXRfUc/view?usp=sharing'
                }
            ],
            lessons: [
                {
                    title: 'الحصه الثالثة',
                    desc: 'الحصه الثالثة  شرح اكمال الجمل',
                    lessonIndex: 2,
                    videoUrl : 'https://player.vimeo.com/video/945481313?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                },
            ]
        }
    ]
}


export async function GET() {
    try {
        connectDB();
        const aLLcourses = await Courses.findOne();
        await aLLcourses.courses.push(course);
        const savedData = await aLLcourses.save();
        return NextResponse.json(savedData)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}