"use client"
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown, User } from 'lucide-react'
import React, { useEffect ,useState} from 'react'
   import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter } from 'next/navigation';

function Feedback({params}) {
  const router = useRouter();
  const [feedbackList, setfeedbackList] = useState([]);
  useEffect(()=>{
    GetFeedback();
  },[]);
  const GetFeedback=async()=>{
       const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,params.interviewid)).orderBy(UserAnswer.id);
       console.log(result);
       setfeedbackList(result);

  }

  return (
    <div className='p-10 '>
      <h2 className='text-3xl font-bold text-red-600'>Congratulations !</h2>
      <h2 className='font-bold text-2xl '>Here is Your Interview Feedback</h2>
      {feedbackList.length==0 ?
      <h2 className='text-gray-500 font-bold text-2xl'>No Interview Feedback Record Found</h2>:
       
      <>
    <h2 className='text-primary text-lg  my-3 '>Your overall interview  <strong>rating & feedback</strong></h2>
    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvment</h2>
    {feedbackList && feedbackList.map((item, index)=>(
       
       <Collapsible key={index} className='mt-7'>
       <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>{item.question}< ChevronsUpDown className='h-5 w-5'/></CollapsibleTrigger>
       <CollapsibleContent>
         <div className='flex flex-col gap-2'>
          <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating :</strong>{item.rating}</h2>
          <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer :</strong>{item.userAns}</h2>
          <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer :</strong>{item.correctAnswer}</h2>
          <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback :</strong>{item.feedback}</h2>
         </div>
       </CollapsibleContent>
     </Collapsible>
      ))} </>}
      <Button  className ='mt-5' onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback