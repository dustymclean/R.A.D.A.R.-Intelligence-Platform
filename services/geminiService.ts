import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Recommendation, RetrievalData } from "../types";

// Initialize Gemini Client
// API Key is strictly sourced from environment variables as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskScore: {
      type: Type.INTEGER,
      description: "A calculated risk score from 0 (Safe) to 100 (Critical) based on the content.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise executive summary of the retrieved intelligence.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key terms extracted from the text.",
    },
    detectedEntities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Organizations, people, or locations identified.",
    },
    complianceTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant compliance frameworks (e.g., NIST, ISO 27001, GDPR, HIPAA) applicable to this data.",
    },
  },
  required: ["riskScore", "summary", "keywords", "detectedEntities", "complianceTags"],
};

const adviceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          frameworkReference: { type: Type.STRING },
        },
        required: ["title", "description", "priority"],
      },
    },
  },
  required: ["recommendations"],
};

export const analyzeContent = async (data: RetrievalData): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Perform a security and intelligence analysis on the following retrieved data.
      Source: ${data.source}
      Classification: ${data.classification}
      
      Content:
      "${data.content}"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert intelligence analyst for a cybersecurity GRC platform. Analyze the input for risks, compliance gaps, and key intelligence.",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI model.");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateAdvice = async (analysis: AnalysisResult): Promise<Recommendation[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Based on the following analysis, provide 3-5 actionable recommendations.
      Risk Score: ${analysis.riskScore}
      Summary: ${analysis.summary}
      Compliance Context: ${analysis.complianceTags.join(", ")}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: adviceSchema,
        systemInstruction: "You are a senior security advisor. Provide clear, actionable steps aligned with NIST and ISO standards.",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI model.");
    }

    const json = JSON.parse(response.text);
    return json.recommendations as Recommendation[];
  } catch (error) {
    console.error("Advice generation failed:", error);
    throw error;
  }
};
