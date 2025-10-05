'use client'
import Image from 'next/image';
import up from  '../../public/UserImage/up.jpg';
import { VscGithub } from "react-icons/vsc";
import Link from 'next/link';
import NextRouter from '@/components/layout/NextRouter';
import AnimatedContent from '@/components/ui/shadcnComponents/AnimatedContent';

export default function Home() {
  return (
    <>
  
     <div>
      <NextRouter>
       
      <article className="h-screen bg-cover homebg bg-center bg-no-repeat  to-white p-6">
         <AnimatedContent
          distance={150}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
        >
        <section className="hero  min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse gap-22">
            <div className=" ">
            <Image src={up} alt='' className="max-w-sm rounded-lg shadow-2xl w-50 " />
            </div>
            <div>
              
              <h1 className="mt-2 text-5xl font-bold text-center">Raect banzai!</h1>

              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat
              </p>
              <div className="flex gap-10 justify-center">
                <Link href='/article'>
                <div className="mt-2 bg-blue-500 p-3 btn text-white border-white">查看笔记</div>
                </Link>
                
                <VscGithub  className="btn bg-black border-0 text-white  border-black p-0 p-2  mt-2" />
                </div>
            </div>
          </div>
        </section>
       
      </AnimatedContent>
        
      </article>
       </NextRouter>
    </div>
   
    </>
  );
}
