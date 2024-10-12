"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'


function RecordAnswersection({activeQuestionIndex, mockInterviewQuestion ,interviewData}) {
const[useranswer , setuseranswer]=useState(''); 
const{user}=useUser();
const [loading , setloading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });
      useEffect(()=>{
        results.map((result )=>(
             setuseranswer((Prevans)=>Prevans+result?.transcript)
        ))   
      },[results])
     

      useEffect(()=>{
          if(!isRecording && useranswer?.length>10){
              UpdateUserAnswer();
          }

      },[useranswer]);

      const StartStopRecording =async()=>{
        if(isRecording){
          stopSpeechToText();
           }

        else{
          startSpeechToText();
         
          }
      
      }

      const UpdateUserAnswer =async()=>{
        
        setloading(true);
        const FeedbackPrompt ="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+",User Answer:"+useranswer+",depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any "+"in just 3 to 5 lines to improve it  in JSON format  with rating field and feedback field";
        const result =  await chatSession.sendMessage(FeedbackPrompt);

        const mockJsonResp = (result.response.text()).replace('```json', '')
        .replace('```', '');
        console.log("my rating and feeback is" , mockJsonResp);
        const JsonFeedback = JSON.parse(mockJsonResp);
        console.log("my rating and feeback seperate way " , JsonFeedback);
        console.log("Active Question Index:", activeQuestionIndex);

        console.log("Mock id ref is", interviewData?.mockId);
        console.log("Mock Interview Question:", mockInterviewQuestion[activeQuestionIndex]?.question);
        console.log("Correct Answer:", mockInterviewQuestion[activeQuestionIndex]?.answer);


        
        try {
          const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId || 'unknown',
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns: useranswer,
            feedback: JsonFeedback?.feedback,
            rating: JsonFeedback?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress || "unknown",
            createdAt: new Date(),
          });
          
          if (resp) {
            toast('Answer Saved Successfully');
            setuseranswer('');
            setResults([]);
          }
        } catch (error) {
          console.error(' DB Error :', error);
          toast('Error saving answer');
        } finally {
          setuseranswer('');
          setResults([]);
          setloading(false);
        }
    
             
      }
  return (
    <div className='flex items-center justify-items-center flex-col'>
    <div className='flex flex-col justify-center items-center rounded-lg mt-20 border'>
        <Image src={"/web2.png"} width={200} height={200} className='absolute'/>
        <Webcam
        mirrored={true}
        style={{
            height:300,
            width:'100%',
            zIndex: 10,
        
        }}/>
    </div>
     <Button disabled={loading} variant="outline"  className='my-10  ' onClick={StartStopRecording}>
      {isRecording ?
      <h2 className='text-red-800 flex gap-2 items-center'><StopCircle/>Stop Recording</h2>:
     < h2 className='text-primary flex gap-2 items-center'><Mic/>Start Recording</h2>}
      </Button>

      {/* <Button onClick={()=>console.log(useranswer)}>Show User Answer</Button> */}
    
  </div>
  )
}

export default RecordAnswersection