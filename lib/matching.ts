import { Customer } from "@/types";

export interface CompatibilityResult {
  score: number;
  reasons: string[];
  tags: {
    education: boolean;
    family: boolean;
    lifestyle: boolean;
    relocation: boolean;
  };
}

/**
 * Calculates the compatibility score between two customers based on specific criteria.
 * Total possible score: 100 points.
 */
export function calculateCompatibilityScore(user: Customer, candidate: Customer): CompatibilityResult {
  let score = 0;
  const reasons: string[] = [];
  const tags = {
    education: false,
    family: false,
    lifestyle: false,
    relocation: false
  };

  // 1. Children Preference (25 points)
  if (user.wantKids === candidate.wantKids) {
    score += 25;
    reasons.push(user.wantKids ? "Both desire children" : "Both prefer a child-free lifestyle");
    tags.family = true;
  }

  // 2. Religion Compatibility (15 points)
  if (user.religion === candidate.religion) {
    score += 15;
    reasons.push(`Shared religious background (${user.religion})`);
  }

  // 3. Location Compatibility (15 points)
  if (user.city === candidate.city && user.country === candidate.country) {
    score += 15;
    reasons.push(`Both based in ${user.city}`);
    tags.relocation = true;
  } else if (user.country === candidate.country) {
    score += 10;
    reasons.push(`Based in the same country (${user.country})`);
  }

  // 4. Education Compatibility (15 points)
  const higherEd = ["Masters", "PhD", "MBA", "MD", "B.Tech", "M.Tech"];
  const userIsHigher = higherEd.some(edu => user.degree.includes(edu));
  const candidateIsHigher = higherEd.some(edu => candidate.degree.includes(edu));

  if (user.degree === candidate.degree) {
    score += 15;
    reasons.push(`Matching educational background (${user.degree})`);
    tags.education = true;
  } else if (userIsHigher && candidateIsHigher) {
    score += 10;
    reasons.push("Both have pursued similar level of higher education");
    tags.education = true;
  }

  // 5. Career Compatibility (10 points)
  if (user.designation === candidate.designation) {
    score += 10;
    reasons.push(`Similar professional roles (${user.designation})`);
  } else if (user.company === candidate.company) {
    score += 8;
    reasons.push(`Work at the same organization (${user.company})`);
  }

  // 6. Lifestyle Compatibility (10 points)
  const commonHobbies = user.hobbies.filter(hobby => candidate.hobbies.includes(hobby));
  const commonTraits = user.personalityTraits.filter(trait => candidate.personalityTraits.includes(trait));
  
  if (commonHobbies.length > 0 || commonTraits.length > 0 || user.openToPets === candidate.openToPets) {
    let lifestyleScore = 0;
    if (commonHobbies.length > 0) lifestyleScore += 4;
    if (commonTraits.length > 0) lifestyleScore += 3;
    if (user.openToPets === candidate.openToPets) lifestyleScore += 3;
    
    score += lifestyleScore;
    if (commonHobbies.length > 0) reasons.push(`Shared interests: ${commonHobbies.slice(0, 2).join(", ")}`);
    if (commonTraits.length > 0) reasons.push(`Compatible personalities: ${commonTraits.slice(0, 2).join(", ")}`);
    if (user.openToPets === candidate.openToPets) reasons.push(user.openToPets ? "Both love pets" : "Both prefer no pets");
    
    if (commonHobbies.length > 0 || commonTraits.length > 1) {
      tags.lifestyle = true;
    }
  }

  // 7. Relocation Preference (10 points)
  if (user.openToRelocate && candidate.openToRelocate) {
    score += 10;
    reasons.push("Both are open to relocating for the right match");
    tags.relocation = true;
  } else if (user.city === candidate.city) {
    // Already set tags.relocation = true above if in same city
    if (!tags.relocation) {
      score += 10;
      reasons.push("Already in the same city, relocation not required");
      tags.relocation = true;
    }
  } else if (user.openToRelocate || candidate.openToRelocate) {
    score += 5;
    reasons.push("One partner is open to relocation");
    tags.relocation = true;
  }

  return { score, reasons, tags };
}

/**
 * Returns the top 10 ranked matches for a given customer from a pool of candidates.
 */
export function getTopMatches(user: Customer, pool: Customer[]): (Customer & { matchDetails: CompatibilityResult })[] {
  // Filter out the user themselves and filter by opposite gender (assuming heterosexual for this context)
  // In a real app, this would be based on user's orientation preferences.
  const candidates = pool.filter(c => c.id !== user.id && c.gender !== user.gender);

  const rankedMatches = candidates.map(candidate => ({
    ...candidate,
    matchDetails: calculateCompatibilityScore(user, candidate)
  }));

  // Sort by score descending and take top 10
  return rankedMatches
    .sort((a, b) => b.matchDetails.score - a.matchDetails.score)
    .slice(0, 10);
}
