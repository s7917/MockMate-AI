import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",

  dbCredentials: {
    url: 'postgresql://neondb_owner:nW1Mcqk5rRme@ep-misty-bonus-a5qlzvyp.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }, 
});