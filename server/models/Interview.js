import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: String,
  experienceLevel: String,
  questions: [String],
  responses: [{
    question: String,
    response: String,
    strengths: [String],
    suggestions: [String],
    score: Number,
    keywordAnalysis: {
      relevant: [String],
      irrelevant: [String]
    }
  }],
  score: Number,
  topics: [{
    name: String,
    score: Number
  }],
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', interviewSchema);
