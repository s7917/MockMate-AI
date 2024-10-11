"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ghost, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";



function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobposition, setJobPosition] = useState();
  const [jobDiscription, setJobDiscription] = useState();
  const [yearOfExperience, setYearOfExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  // const onSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   console.log(jobposition, jobDiscription, yearOfExperience);

  //   const InputPromt ="Job Position: "+jobposition+" Job Discription: "+jobDiscription+" Year of Experience: "+yearOfExperience+"give is "+process.env.NEXT_PUBLIC_INTERVIEW_COUNT_QUESTION+" top interview questions along with answers in json format , give us question and answer in json format";
      
  //   const result = await chatSession.sendMessage(InputPromt); 
  //   // console.log("without parser:" ,result.response.text());
  //   const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
  //   console.log(JSON.parse(MockJsonResp));
  //   setJsonResponse(MockJsonResp);
  //    if(MockJsonResp){
  //   const resp = await db.insert(MockInterview).values({
  //     mockId: uuidv4(),
  //     jsonMockRes: MockJsonResp,
  //     jobPosition: jobposition,
  //     jobDiscription: jobDiscription,
  //     yearOfExperience: yearOfExperience,
  //     createBy: user?.primaryEmailAddress?.emailAddress,
  //     createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   }).returning({ mockId: MockInterview.mockId });

  //   console.log("Inserted mockid is",resp);
  // }
  // else{
  //   console.log("Error in response");
  // }
  // setLoading(false);
  // };
 
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobposition, jobDiscription, yearOfExperience);
  
    const InputPromt = "Job Position: "+jobposition+" ,Job Discription: " +jobDiscription+" ,Year of Experience: " +yearOfExperience+ "give us" +process.env.NEXT_PUBLIC_INTERVIEW_COUNT_QUESTION+ "top interview questions along with answers in JSON format.";
  
    try {
      const result = await chatSession.sendMessage(InputPromt); 
      const responseText = await result.response.text(); // Ensure to await text response
      console.log("Raw response text:", responseText);
  
      // Sanitize the response and remove code block markers
      const MockJsonResp = responseText
        .replace('```json', '')
        .replace('```', '') // Remove unwanted characters like new lines, tabs, etc.

        console.log("Sanitized JSON:", MockJsonResp);
  
      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(MockJsonResp);
        console.log("Parsed JSON:", parsedResponse);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setLoading(false);
        return; // Exit if parsing fails
      }
  
      setJsonResponse(MockJsonResp); // Update state with the parsed JSON
  
      // Insert the parsed JSON into the database
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockRes: MockJsonResp,
        jobPosition: jobposition || "Unknown",
        jobDesc: jobDiscription || "No description",
        jobExperience: yearOfExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
        createAt: new Date().toString(),
      }).returning({ mockId: MockInterview.mockId });
      console.log("Inserted mock ID:", resp?.[0]?.mockId);
      if(resp){
      setOpenDialog(false);
      router.push(`/dashboard/interview/`  +resp?.[0]?.mockId);
      }

    } 

    catch (error) {
      console.error("Error during chat session or handling response:", error);
    } finally {
      setLoading(false);
    }
  };
  
   
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Tell us more about your job interview</DialogTitle>
            <form onSubmit={onSubmit}>
              <DialogDescription>
                <div>
                  <h3>Add Details about your job position, your skills, and years of experience</h3>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex- Full stack developer" required onChange={(event) => setJobPosition(event.target.value)} />
                  </div>

                  <div className="my-3">
                    <label>Job Description/TechStack (in short)</label>
                    <Textarea placeholder="Ex- Nodejs, Angular, C++, DSA, etc" required onChange={(event) => setJobDiscription(event.target.value)} />
                  </div>

                  <div className="my-3">
                    <label>Years of experience</label>
                    <Input placeholder="Ex- 5" type="number" required max="50" onChange={(event) => setYearOfExperience(event.target.value)} />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="button" variant={Ghost} onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <><LoaderCircle className="animate-spin" /> Generating from AI</>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </DialogDescription>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
