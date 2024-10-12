import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({activeQuestionIndex , mockInterviewQuestion }) {
   
    const textToSpeach =(text)=>{
       if('speechSynthesis' in window ){
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
       }
       else{
        alert('Your browser does not support text to speach');
       }
    }

  return mockInterviewQuestion &&(
    <div className='p-5 border rounded-lg my-10'>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
        
        <h2 className={`p-2 bg-secondary rounded-lg text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex ==index && '  bg-red-500  text-white'}`}>question #{index +1}</h2>

    ))}

        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>


        <div className='border rounded-lg p-5 bg-green-400 mt-20'>
            <h2  className='flex gap-5 items-center '>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm  my-2 '>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
    </div>
  );
}

export default QuestionSection;
