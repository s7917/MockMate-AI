// "use client"
// import { eq } from 'drizzle-orm';
// import React from 'react'
// import { useEffect } from 'react'
// import { MockInterview } from '@/utils/schema';
// import { db } from '@/utils/db';
// import { useState } from 'react';
// import Webcam from 'react-webcam';
// import { Button } from '@/components/ui/button';
// import schema from '@/utils/schema';
// function Interview({params}) { 

//     const[interviewData , setInterviewData] = useState([]);
//     const[WebCamEnabled, setWebCamEnabled] = useState(false);
//     useEffect(()=>{
//     console.log("our", params.interviewid);
//     GetInterviewDetails();
//     },[]) 
   

//     // used to get interview details by mockid/interview id
//     const GetInterviewDetails = async () => {
//         const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewid));
//         // console.log("result", result); 
//         setInterviewData(result[0]);
//     }
//   return (
//     <div className='my-10 flex justify-center flex-col items-center'>
//     <h2 className ='font-bold text-2xl'>Let's Get started</h2>
//     <div>
//         {WebCamEnabled?<Webcam
//         onUserMedia={()=>setWebCamEnabled(true)}
//         onUserMediaError={()=>setWebCamEnabled(false)}
//         mirrored={true}
//         style={{width: 300, height: 300}} 
//         /> :
//         <> 
//         <Webcam className='h-72 my-7 w-full p-20 bg-secondary rounded-lg border' />
//         <Button onClick={()=>setWebCamEnabled(true)}>Enable WebCam and Microphone</Button>
//         </> 
//         }
//     </div>
//     </div>
//   )
// }

// export default Interview


"use client";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { EyeOff, Ghost, Lightbulb} from "lucide-react";
import Link from "next/link";


function Interview({params}) {
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false); // Track permission denial

  useEffect(() => {
    console.log("Interview ID:", params.interviewid);
    GetInterviewDetails();
  }, []);

  // Used to get interview details by mockId/interviewId
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewid));
    setInterviewData(result[0]);
  };

  // Webcam error handling
  const handleUserMediaError = () => {
    setWebCamEnabled(false);
    setPermissionDenied(true); // Set permission denied if there is an error
  };

  // Render fallback content
  const renderFallback = () => {
    if (permissionDenied) {
      return <p className="text-red-500">Permission denied. Please enable webcam and microphone to proceed.</p>;
    }
    return <p className='text-red-800'>No webcam access. Please enable your webcam to start the interview.</p>;
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      
         <div className = 'grid grid-cols-1 md:grid-cols-2 gap-10'>
    
      <div className='flex flex-col my-5 gap-5 '>
        <div className=' flex flex-col gap-5  p-5 rounded-lg border'>
          <h2 className='text-lg'><strong>Job Role /Position : </strong>{interviewData.jobPosition}</h2>
         <h2 className='text-lg'><strong>Job Discription / Techstack : </strong>{interviewData.jobDesc}</h2>
         <h2 className='text-lg'><strong>Year of Experience : </strong>{interviewData.jobExperience}</h2>
        </div>

        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
           <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /> <strong>Information</strong></h2>
           <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
         
      </div>
      <div className="w-full flex flex-col items-center">
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={handleUserMediaError}
            mirrored={true}
            style={{ width: 300, height: 300 }}
          />
        ) : (
          <>
            <div className="h-72 my-7 w-full p-20 bg-secondary rounded-lg border flex items-center justify-center">
              {renderFallback()}
            </div>
           
            <Button className='gap-2 hover:bg-slate-400' variant ={Ghost}  onClick={() => setWebCamEnabled(true)}>Enable WebCam and Microphone<EyeOff></EyeOff> </Button>
          </>
        )}
      </div>
         </div>
         <div className=' flex justify-end items-end mt-3'>
          <Link href={'/dashboard/Interview/'+params.interviewid+'/start'}>
         <Button>Start Interview</Button>
         </Link>
         </div>
      
    </div>
  );
}

export default Interview;
