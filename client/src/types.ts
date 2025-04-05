export interface Interview {
    _id: string;
    jobRole: string;
    date: string;
    score?: number;
    company?: string;
    responses?: InterviewResponse[];
  }
  
  interface InterviewResponse {
    question: string;
    answer: string;
    feedback: Feedback;
  }
  
  interface Feedback {
    strengths: string[];
    weaknesses: string[];
    score: number;
    suggestions: string[];
  }