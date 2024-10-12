
import { pgTable,  serial, text, varchar } from "drizzle-orm/pg-core";
export const MockInterview= pgTable('MockInterview',{
    id: serial('id').primaryKey(),
    jsonMockRes:text('jsonMockRes').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(), 
    createdBy:varchar('createdBy').notNull(),
    createAt:varchar('createAt').notNull(),
    mockId:varchar('mockId').notNull()  
})

export const UserAnswer= pgTable('UserAnswer',{
    id: serial('id').primaryKey(),
    mockIdRef :varchar('mockId').notNull() ,
    question:varchar('question'),
    correctAnswer:text('correctAnswer'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
    
});