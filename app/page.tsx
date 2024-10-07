'use client';
import Image from "next/image";
import Greetings from "./components/Greetings";
import { useEffect, useState } from "react";
import PreLoader from "./components/PreLoader";
import CalendarSelector from "./components/CalenderSelector";
import CategoryList from "./components/CategoryList";
import AiEmployeeGrid from "./components/AiEmployeeGrid";
import { useUserContext } from "./providers/userContext";
import Link from "next/link";

export default function Home() {

  const { userData, isLoading, error } = useUserContext();

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || isLoading) {

    return (
      <PreLoader/>
    );
  }

  if(error){
   return (
    <div className="h-[100vh] flex justify-center items-center bg-app-gradient px-5  ">

    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
  <strong className="font-bold">Something went wrong!</strong>
  <span className="block">An unknown error occurred. Please try again later.</span>
</div>
</div>
)

  }

  console.log(userData)
  if(!userData?.activeLocation){
    return (
      <div className="h-[100vh] flex justify-center bg-app-gradient px-5  ">
      <div className="hero-container h-full flex flex-row max-w-7xl">
        <div className="hero-container-col1 flex justify-center flex-col flex-1 gap-5 ">
          <Greetings/>
          <p className="hero-content text-2xl font-bold  text-slate-900 leading-8">
          <span className="text-2xl text-slate-900">
  Hold tight! The Agency Dashboard is coming soon.
</span>
        Until then, switch to a sub-account and enjoy the magic!"
          </p>  
        </div>
        <div className="hero-container-col2 flex flex-col items-center justify-center flex-1">
          <Image 
            src="/images/hero-bot.png"  
            width={300} 
            height={300} 
            alt="Bot"  
            className="max-w-xl w-[500px]"
          />
        </div>
        
      </div>
     
      </div>
    )
  }


  
  return (
    <div>
      <div className="h-[700px] flex justify-center bg-app-gradient px-5">
    <div className="hero-container h-full flex flex-row max-w-7xl">
      <div className="hero-container-col1 flex justify-center flex-col flex-1 gap-5 ">
        <Greetings/>
        <p className="hero-content text-2xl font-thin text-white leading-8">
          Let AI Powered IQ Bot Employees 🧠 Take Over Lead Qualification Appointment Booking, and Lead Chasing
        </p>
        <Link href={"/customBuild"}
  className="bg-gray-800 text-white px-6 py-3 rounded-full flex items-center justify-between  w-[max-content]"
>
  Custom Build Ai Employee
</Link>
<div className="mt-[100px]">
        <CalendarSelector/>
        </div>

      </div>
      <div className="hero-container-col2 flex flex-col items-center flex-1">
        <Image 
          src="/images/hero-bot.png"  

          width={300} 
          height={300} 
          alt="Bot"  
          className="max-w-xl w-[500px]"
        />
      </div>
      </div>
      
    </div>
    
      <AiEmployeeGrid />
    </div>
  );
}