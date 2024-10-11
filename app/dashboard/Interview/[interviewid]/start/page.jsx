"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import QuestionSection from './_componenst/QuestionSection';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex , setActiveQuestionIndex] = useState(0);

    
    const GetInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewid));
    
        // Log the raw jsonMockRes to inspect its content
        // console.log("Raw jsonMockRes:", result[0].jsonMockRes);
    
        try {
            // Extract the raw JSON string
            let rawJsonString = result[0].jsonMockRes;
    
            // Remove the unwanted backslashes and escape characters
            rawJsonString = rawJsonString.replace(/\\"/g, '"');  // Replace \" with "
            rawJsonString = rawJsonString.replace(/(^"|"$)/g, ''); // Remove the leading and trailing quotes
            
            // Now we can safely parse the cleaned-up JSON string
            const jsonMockRes = JSON.parse(`${rawJsonString}`); // Wrap in brackets to make it an array of objects
    
            console.log("Parsed jsonMockRes:", jsonMockRes);
            
            setMockInterviewQuestion(jsonMockRes);
            setInterviewData(result[0]);
        } catch (error) {
            console.error("Error processing JSON:", error);
        }
    };
    
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2'>
           {/* question col 1 */}
           <QuestionSection  activeQuestionIndex={activeQuestionIndex}  mockInterviewQuestion ={mockInterviewQuestion} />

        </div>
    );
}

export default StartInterview;
