"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'

function RecordAnswersection() {
const[useranswer , setuseranswer]=useState(''); 
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });
      useEffect(()=>{
        results.map((result )=>(
             setuseranswer((Prevans)=>Prevans+result?.transcript)
        ))   
      },[results])
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
     <Button variant="outline" className='my-10 ' onClick={isRecording?stopSpeechToText:startSpeechToText}>
      {isRecording ?
      <h2 className='text-red-800 flex gap-2'><Mic/>Stop Recording</h2>:
      "Record Answer"}</Button>
      <Button onClick={()=>console.log(useranswer)}>Show User Answer</Button>
    
  </div>
  )
}

export default RecordAnswersection