import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { customer, candidate, score } = await req.json();
    console.log(`Analyzing match: ${customer.firstName} & ${candidate.firstName} (Score: ${score})`);

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in process.env");
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      You are an expert matchmaker assistant. Analyze the compatibility between two individuals and provide a concise report.
      
      Person 1:
      - Name: ${customer.firstName} ${customer.lastName}
      - Age: ${customer.age}
      - City: ${customer.city}
      - Profession: ${customer.designation} at ${customer.company}
      - Education: ${customer.degree}
      - Religion: ${customer.religion}
      - Wants Kids: ${customer.wantKids ? "Yes" : "No"}
      - Open to Relocate: ${customer.openToRelocate ? "Yes" : "No"}
      - Hobbies: ${customer.hobbies.join(", ")}
      - Personality: ${customer.personalityTraits.join(", ")}

      Person 2:
      - Name: ${candidate.firstName} ${candidate.lastName}
      - Age: ${candidate.age}
      - City: ${candidate.city}
      - Profession: ${candidate.designation} at ${candidate.company}
      - Education: ${candidate.degree}
      - Religion: ${candidate.religion}
      - Wants Kids: ${candidate.wantKids ? "Yes" : "No"}
      - Open to Relocate: ${candidate.openToRelocate ? "Yes" : "No"}
      - Hobbies: ${candidate.hobbies.join(", ")}
      - Personality: ${candidate.personalityTraits.join(", ")}

      Calculated Compatibility Score: ${score}/100

      Please generate a JSON response with the following fields:
      - matchSummary: A 2-3 sentence summary of why they are a good match.
      - strengths: A list of 3 key strengths of this pairing.
      - concerns: A list of 2-3 potential concerns or areas for discussion.

      Return ONLY the JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (sometimes Gemini wraps it in markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gemini API Error Details:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze match" },
      { status: 500 }
    );
  }
}
