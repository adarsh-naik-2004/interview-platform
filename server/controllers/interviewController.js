import { GoogleGenerativeAI } from "@google/generative-ai";
import Interview from "../models/Interview.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  },
});

// Helper function to parse Gemini response
const parseGeminiResponse = (textResponse) => {
  try {
    let jsonString = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\/\/.*(?=[\n\r])/g, "") // removes // comments
      .replace(/,\s*}/g, "}") // remove trailing commas before }
      .replace(/,\s*]/g, "]") // remove trailing commas before ]
      .trim();

    // Fix invalid tokens: remove undefined, handle nulls in array
    jsonString = jsonString.replace(/\bundefined\b/g, '""'); // Replace undefined with empty string
    jsonString = jsonString.replace(/\bnull\b/g, '""'); // Replace null with empty string too (optional)

    const result = JSON.parse(jsonString);
    if (typeof result.score !== "number") {
      result.score = parseInt(result.score) || 0;
    }
    return result;
  } catch (error) {
    throw new Error(
      `Failed to parse AI response: ${error.message}\nRaw response: ${textResponse}`
    );
  }
};

// Controller functions
export const evaluateResponse = async (req, res) => {
  const { question, response } = req.body;

  if (!question || !response) {
    return res.status(400).json({ error: "Missing question or response" });
  }

  try {
    const prompt = generateEvaluationPrompt(
      question,
      response,
      req.user.experienceLevel || "mid-level" // Default value
    );

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const feedback = parseGeminiResponse(text);

    res.json({
      ...feedback,
      question,
      response,
      evaluationDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({
      error: "AI evaluation failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Remaining controller functions unchanged
export const saveInterview = async (req, res) => {
  const { jobRole, experienceLevel, questions, responses, score, topics } =
    req.body;

  if (!questions || !responses || !score) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const validatedResponses = responses.map(res => ({
      question: res.question,
      response: res.response,
      strengths: Array.isArray(res.strengths) ? res.strengths : [],
      suggestions: Array.isArray(res.suggestions) ? res.suggestions : [],
      score: typeof res.score === 'number' ? res.score : 0,
      keywordAnalysis: {
        relevant: Array.isArray(res.keywordAnalysis?.relevant) 
          ? res.keywordAnalysis.relevant : [],
        irrelevant: Array.isArray(res.keywordAnalysis?.irrelevant) 
          ? res.keywordAnalysis.irrelevant : []
      }
    }));
    
    const interview = new Interview({
      user: req.user._id,
      jobRole,
      experienceLevel,
      questions,
      responses: validatedResponses,
      score,
      topics,
      date: new Date()
    });

    const saved = await interview.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save Interview Error:", err);
    res.status(500).json({ error: "Failed to save interview" });
  }
};

export const generateQuestions = async (req, res) => {
  const { jobRole, experienceLevel } = req.body;

  try {
    const prompt = `Generate 5 technical interview questions for a 
        ${experienceLevel} ${jobRole} position. Format as JSON array:
        ["question1", "question2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean response
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(jsonString));
  } catch (error) {
    console.error("Generation Error:", error);
    res.status(500).json({
      error: "Question generation failed",
      details: error.message,
    });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// Helper function
const generateEvaluationPrompt = (question, response, experienceLevel) => `
  [ROLE]
  You are an expert interview coach analyzing a technical interview response.
  The candidate is applying for a ${experienceLevel} position.

  [INSTRUCTIONS]
  1. Analyze the response for technical accuracy and communication skills
  2. Identify key strengths and areas for improvement
  3. Score the response from 0-100 considering experience level
  4. Provide actionable suggestions
  5. Analyze keywords

  [RESPONSE FORMAT]
  {
    "strengths": ["3 concise bullet points"],
    "weaknesses": ["3 concise bullet points"],
    "score": "number 0-100",
    "suggestions": ["3 actionable items"],
    "keywordAnalysis": {
      "relevant": ["top 5 technical terms"],
      "irrelevant": ["top 5 filler/unrelated words"]
    }
  }

  [QUESTION]
  ${question}

  [CANDIDATE RESPONSE]
  ${response}
`;
