import { Customer } from "@/types";

export interface CompatibilityResult {
  score: number;
  futureGoals: number;
  lifestyle: number;
  family: number;
  career: number;
  location: number;
  strengths: string[];
  concerns: string[];
}

/**
 * Helper to parse height string "5'10\"" to total inches
 */
function parseHeight(heightStr: string): number {
  try {
    const match = heightStr.match(/(\d+)'(\d+)/);
    if (!match) return 0;
    return parseInt(match[1]) * 12 + parseInt(match[2]);
  } catch {
    return 0;
  }
}

/**
 * Helper to parse income string "$120,000" to number
 */
function parseIncome(incomeStr: string): number {
  try {
    return parseInt(incomeStr.replace(/[^0-9]/g, '')) || 0;
  } catch {
    return 0;
  }
}

/**
 * Calculates the compatibility score between two customers based on specific criteria.
 */
export function calculateCompatibilityScore(user: Customer, candidate: Customer): CompatibilityResult {
  const result: CompatibilityResult = {
    score: 0,
    futureGoals: 0,
    lifestyle: 0,
    family: 0,
    career: 0,
    location: 0,
    strengths: [],
    concerns: []
  };

  if (user.gender === 'Male') {
    // Male Matching Logic
    
    // 1. Future Goals / Children (25 pts)
    if (user.wantKids === candidate.wantKids) {
      result.futureGoals += 25;
      result.strengths.push(user.wantKids ? "Both want children" : "Both child-free");
    } else {
      result.concerns.push("Different views on having children");
    }

    // 2. Age Preference (10 pts) - Female younger
    if (candidate.age < user.age) {
      result.lifestyle += 10;
      result.strengths.push("Age preference met (Female younger)");
    } else if (candidate.age === user.age) {
      result.lifestyle += 5;
    } else {
      result.concerns.push("Candidate is older than preferred");
    }

    // 3. Height Preference (10 pts) - Female shorter
    const userH = parseHeight(user.height);
    const candH = parseHeight(candidate.height);
    if (candH < userH) {
      result.lifestyle += 10;
      result.strengths.push("Height preference met (Female shorter)");
    } else {
      result.concerns.push("Candidate is taller than preferred");
    }

    // 4. Income Preference (10 pts) - Income lower
    const userI = parseIncome(user.income);
    const candI = parseIncome(candidate.income);
    if (candI <= userI) {
      result.career += 10;
      result.strengths.push("Compatible income levels");
    } else {
      result.concerns.push("Candidate has higher income");
    }

    // 5. Religion (10 pts)
    if (user.religion === candidate.religion) {
      result.family += 10;
      result.strengths.push(`Same religion: ${user.religion}`);
    } else {
      result.concerns.push("Different religious backgrounds");
    }

    // 6. Lifestyle (10 pts)
    let lifestylePoints = 0;
    if (user.diet === candidate.diet) lifestylePoints += 4;
    if (user.smoking === candidate.smoking) lifestylePoints += 3;
    if (user.drinking === candidate.drinking) lifestylePoints += 3;
    result.lifestyle += lifestylePoints;
    if (lifestylePoints >= 7) result.strengths.push("Very compatible lifestyle");

    // 7. Location (10 pts)
    if (user.city === candidate.city) {
      result.location += 10;
      result.strengths.push(`Both based in ${user.city}`);
    } else if (user.openToRelocate || candidate.openToRelocate) {
      result.location += 7;
      result.strengths.push("Flexible with location");
    } else {
      result.concerns.push("Different cities and neither open to relocate");
    }

    // 8. Education (10 pts)
    if (user.degree === candidate.degree) {
      result.career += 10;
      result.strengths.push("Matching educational background");
    } else {
      result.career += 5;
    }

    // 9. Family Compatibility (5 pts)
    if (user.familyType === candidate.familyType) {
      result.family += 5;
      result.strengths.push("Similar family structure");
    }

    // Combine into total score
    result.score = result.futureGoals + result.lifestyle + result.family + result.career + result.location;

  } else {
    // Female Matching Logic
    
    // 1. Future Goals (25 pts) - Kids, Relocation, Family Type
    let goalsPoints = 0;
    if (user.wantKids === candidate.wantKids) goalsPoints += 15;
    if (user.openToRelocate === candidate.openToRelocate) goalsPoints += 5;
    if (user.familyType === candidate.familyType) goalsPoints += 5;
    result.futureGoals = goalsPoints;
    if (user.wantKids === candidate.wantKids) result.strengths.push("Aligned on future family goals");

    // 2. Values (20 pts)
    const valueTraits = ["Family-Oriented", "Career-Oriented", "Spiritual", "Traditional", "Modern"];
    const userAllText = (user.personalityTraits.join(" ") + " " + (user.partnerExpectations || "")).toLowerCase();
    const candidateAllText = (candidate.personalityTraits.join(" ") + " " + (candidate.partnerExpectations || "")).toLowerCase();
    
    const matchingValues = valueTraits.filter(v => 
      userAllText.includes(v.toLowerCase()) && 
      candidateAllText.includes(v.toLowerCase())
    );
    
    const commonTraits = user.personalityTraits.filter(t => 
      candidate.personalityTraits.some(ct => ct.toLowerCase() === t.toLowerCase())
    );
    
    result.lifestyle += Math.min(20, matchingValues.length * 8 + commonTraits.length * 4);
    if (matchingValues.length > 0) result.strengths.push(`Shared values: ${matchingValues.slice(0, 2).join(", ")}`);
    else if (commonTraits.length > 0) result.strengths.push(`Compatible traits: ${commonTraits.slice(0, 2).join(", ")}`);

    // 3. Profession (15 pts) - Stability, Education, Occupation
    let profPoints = 0;
    if (user.degree === candidate.degree) profPoints += 5;
    if (user.designation === candidate.designation) profPoints += 5;
    const userI = parseIncome(user.income);
    const candI = parseIncome(candidate.income);
    if (candI >= userI) profPoints += 5;
    result.career = profPoints;
    if (profPoints >= 10) result.strengths.push("Strong career compatibility");

    // 4. Lifestyle (15 pts) - Diet, Smoking, Drinking, Hobbies
    let lifestylePoints = 0;
    if (user.diet === candidate.diet) lifestylePoints += 5;
    if (user.smoking === candidate.smoking) lifestylePoints += 3;
    if (user.drinking === candidate.drinking) lifestylePoints += 3;
    const commonHobbies = user.hobbies.filter(h => candidate.hobbies.includes(h));
    lifestylePoints += Math.min(4, commonHobbies.length * 2);
    result.lifestyle += lifestylePoints;
    if (lifestylePoints >= 10) result.strengths.push("Compatible daily lifestyle");

    // 5. Location (10 pts)
    if (user.city === candidate.city) {
      result.location = 10;
      result.strengths.push(`Conveniently located in ${user.city}`);
    } else if (user.openToRelocate || candidate.openToRelocate) {
      result.location = 7;
      result.strengths.push("Open to relocation");
    } else {
      result.concerns.push("Long-distance / Location mismatch");
    }

    // 6. Family Compatibility (15 pts) - Religion, Tongue, Family Type
    let famPoints = 0;
    if (user.religion === candidate.religion) famPoints += 7;
    if (user.familyType === candidate.familyType) famPoints += 4;
    const commonLang = user.languages.filter(l => candidate.languages.includes(l));
    if (commonLang.length > 0) famPoints += 4;
    result.family = famPoints;
    if (famPoints >= 10) result.strengths.push("Strong cultural & family alignment");

    // Combine into total score
    result.score = result.futureGoals + result.lifestyle + result.family + result.career + result.location;
  }

  // Final score normalization
  result.score = Math.min(100, Math.max(0, result.score));
  
  // Add some general concerns if score is low
  if (result.score < 60 && result.concerns.length === 0) {
    result.concerns.push("Multiple minor compatibility gaps");
  }

  return result;
}

/**
 * Returns the top 10 ranked matches for a given customer from a pool of candidates.
 */
export function getTopMatches(user: Customer, pool: Customer[]): (Customer & { matchDetails: CompatibilityResult })[] {
  // Filter out the user themselves and filter by opposite gender (assuming heterosexual for this context)
  // Logic: 
  // 1. If the user is from the match pool (ID starts with 'POOL-'), they should only match with assigned customers (ID starts with 'CUST-').
  // 2. If the user is an assigned customer, they can match with anyone (the entire candidate universe).
  const candidates = pool.filter(c => {
    // Basic exclusions
    if (c.id === user.id || c.gender === user.gender) return false;

    // Pool ID specific logic
    if (user.id.startsWith('POOL-')) {
      return c.id.startsWith('CUST-');
    }

    return true;
  });

  const rankedMatches = candidates.map(candidate => ({
    ...candidate,
    matchDetails: calculateCompatibilityScore(user, candidate)
  }));

  // Sort by score descending and take top 10
  return rankedMatches
    .sort((a, b) => b.matchDetails.score - a.matchDetails.score)
    .slice(0, 10);
}
