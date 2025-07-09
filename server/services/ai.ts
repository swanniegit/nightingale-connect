import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

export interface AIAnalysisResult {
  isRelevant: boolean;
  suggestion: string;
  suggestionType: 'local' | 'llm';
  faqReferences: number[];
  educationReferences: number[];
  confidence: number;
}

export interface LLMResponseResult {
  response: string;
  confidence: number;
  isHelpful: boolean;
}

export async function analyzeMessage(content: string): Promise<AIAnalysisResult | null> {
  try {
    // Get all FAQs and educational content for context
    const faqs = await storage.getFAQs();
    const educationalContent = await storage.getEducationalContent();

    // Create context for the AI
    const faqContext = faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer.substring(0, 200), // Limit length
      category: faq.category,
    }));

    const educationContext = educationalContent.map(content => ({
      id: content.id,
      title: content.title,
      content: content.content.substring(0, 200), // Limit length
      category: content.category,
    }));

    const prompt = `
You are an AI assistant for South African nurse practitioners. Analyze the following message and determine if it contains a question or topic that can be answered by existing FAQ or educational content.

Message: "${content}"

Available FAQs:
${JSON.stringify(faqContext, null, 2)}

Available Educational Content:
${JSON.stringify(educationContext, null, 2)}

Respond with JSON in this format:
{
  "isRelevant": boolean,
  "suggestion": "A helpful suggestion if relevant, otherwise empty string",
  "faqReferences": [array of FAQ IDs that are relevant],
  "educationReferences": [array of educational content IDs that are relevant],
  "confidence": number between 0 and 1
}

Only mark as relevant if there is a clear match with existing content. Focus on medical questions, medication queries, procedures, and clinical guidelines.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for South African nurse practitioners. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response structure
    if (
      typeof result.isRelevant === "boolean" &&
      typeof result.suggestion === "string" &&
      Array.isArray(result.faqReferences) &&
      Array.isArray(result.educationReferences) &&
      typeof result.confidence === "number"
    ) {
      return {
        ...result,
        suggestionType: 'local' as const
      } as AIAnalysisResult;
    } else {
      console.error("Invalid AI response structure:", result);
      return null;
    }
  } catch (error) {
    console.error("Error analyzing message:", error);
    return null;
  }
}

export async function askWoundAssistant(userQuestion: string): Promise<string | null> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a GPT-based assistant trained to support nurse practitioners in South Africa with wound care questions. Your specialty is evidence-based wound healing. Provide direct, concise answers to clinical questions. Always include a clear disclaimer like 'This is not medical advice; always consult clinical guidelines or a supervising doctor.' Do not offer diagnosis. Avoid mental health, pediatrics, pregnancy, or emergency care. Respect POPIA: Do not store or share personal data. Never claim to be a doctor or licensed provider.",
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error with wound assistant:', error);
    return null;
  }
}

export async function generateLLMResponse(content: string): Promise<LLMResponseResult | null> {
  try {
    const response = await askWoundAssistant(content);
    
    if (!response) {
      return null;
    }
    
    return {
      response: response,
      confidence: 0.9,
      isHelpful: response.length > 50
    };
  } catch (error) {
    console.error('Error generating LLM response:', error);
    return null;
  }
}
