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
import moment from "moment";
import { db } from "@/utils/db";


function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobposition, setJobPosition] = useState();
  const [jobDiscription, setJobDiscription] = useState();
  const [yearOfExperience, setYearOfExperience] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobposition, jobDiscription, yearOfExperience);

    const InputPromt ="Job Position: "+jobposition+" Job Discription: "+jobDiscription+" Year of Experience: "+yearOfExperience+"give is "+process.env.NEXT_PUBLIC_INTERVIEW_COUNT_QUESTION+" top interview questions along with answers in json format , give us question and answer in json format";
      
    const result = await chatSession.sendMessage(InputPromt); 
    // console.log(result.response.text());
    const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
    console.log(JSON.parse(MockJsonResp));
    setLoading(false);
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
