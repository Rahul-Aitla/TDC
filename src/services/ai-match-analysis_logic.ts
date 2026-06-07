import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { customerProfile, candidateProfile, compatibilityResult } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in process.env");
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
You are a senior Indian matchmaking consultant with 15+ years of experience. 

Your role is NOT to calculate compatibility scores. 

Compatibility scoring has already been completed by a deterministic matchmaking engine. 

Your role is to explain the human side of the match, specifically focusing ONLY on these four areas:
1. Partner Expectations (How they align with each other's stated needs)
2. Personality Traits (How their characters complement or challenge each other)
3. Hobbies & Interests (Shared passions and lifestyle synergy)
4. Life Goals (Long-term vision and values)

Important Rules: 

- Do not recalculate compatibility. 
- Do not speculate about future relationship dynamics.
- Only discuss observable alignment based on the provided profile data.-
- Do not mention numerical scores. 
- Do not repeat obvious facts already captured by the scoring engine (e.g., "Both are MBA", "Same City").
- Do not assume traits not explicitly provided. 
- Be factual and professional. 
- Avoid generic relationship advice. 
- Use the category scores as supporting evidence, but focus on explaining the human meaning behind them.

Analyze: 
- How the candidate fulfills the customer's expectations and vice-versa.
- The synergy between their personality traits (e.g., Ambitious vs Supportive).
- How their hobbies (e.g., Travel, Fitness) create shared experiences.
- Alignment in their life goals and values.

Example of Insightful Reasoning:
"Arjun is looking for a family-oriented partner who values growth; Kyra's profile strongly reflects these qualities through her career choices and stated partner expectations, suggesting she is the supportive and growth-minded companion he seeks."

Customer Profile: 
${JSON.stringify(customerProfile, null, 2)} 

Candidate Profile: 
${JSON.stringify(candidateProfile, null, 2)} 

Rule Engine Output: 
${JSON.stringify(compatibilityResult, null, 2)} 

Return ONLY valid JSON. 

{ 
  "compatibilitySummary": "1-2 sentence professional summary focused on the 4 areas above", 

  "expectationAlignment": [ 
    "insight into how expectations align", 
    "insight into mutual needs being met" 
  ], 

  "keyStrengths": [ 
    "personality or hobby synergy", 
    "life goal alignment" 
  ], 

  "potentialConcerns": [ 
    "nuanced personality or goal mismatch", 
    "expectation gap" 
  ],  

  "matchmakerRecommendation": "recommendation focusing on human compatibility", 

  "introEmail": { 
    "subject": "subject line", 
    "body": "2-3 sentence professional personalized introduction email" 
  } 
} 
 `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const rawData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    // Ensure all required fields exist with default values to prevent frontend crashes
    const data = {
      compatibilitySummary: rawData.compatibilitySummary || "",
      expectationAlignment: rawData.expectationAlignment || [],
      keyStrengths: rawData.keyStrengths || [],
      potentialConcerns: rawData.potentialConcerns || [],
      firstConversationTopics: rawData.firstConversationTopics || [],
      matchmakerRecommendation: rawData.matchmakerRecommendation || "",
      introEmail: {
        subject: rawData.introEmail?.subject || "Introduction",
        body: rawData.introEmail?.body || ""
      }
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze match";
    console.error("Gemini API Error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
