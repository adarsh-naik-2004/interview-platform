import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  questions: [{
    text: String,
    difficulty: String
  }],
  responses: [{
    question: String,
    answer: String,
    feedback: {
      strengths: [String],
      weaknesses: [String],
      score: Number,
      suggestions: [String]
    }
  }],
  company: String,
  jobRole: String,
  date: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Interview', interviewSchema);