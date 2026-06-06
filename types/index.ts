export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Unmarried' | 'Divorced' | 'Widow' | 'Widower' | 'Awaiting Divorce';
export type CustomerStatus = 
  | "Profile Created" 
  | "Verification Pending" 
  | "Verified" 
  | "Intro Call Scheduled" 
  | "Intro Call Completed" 
  | "Match Suggestions Generated" 
  | "Matches Sent" 
  | "Feedback Awaiting" 
  | "Meeting Scheduled" 
  | "Active Search" 
  | "Successfully Matched" 
  | "On Hold";

export type MembershipTier = "Premium" | "Standard";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  city: string;
  country: string;
  height: string; // e.g., "5'10\""
  email: string;
  phone: string;
  college: string;
  degree: string;
  income: string;
  company: string;
  designation: string;
  maritalStatus: MaritalStatus;
  membershipTier: MembershipTier;
  languages: string[];
  religion: string;
  caste: string;
  siblings: number;
  wantKids: boolean;
  openToRelocate: boolean;
  openToPets: boolean;
  hobbies: string[];
  personalityTraits: string[];
  status: CustomerStatus;
  profileVerified: boolean;
  
  // Marriage Biodata Additional Fields
  timeOfBirth?: string;
  placeOfBirth?: string;
  subcaste?: string;
  horoscopeDetails?: string;
  rashi?: string;
  nakshatra?: string;
  manglik?: boolean;
  weight?: string;
  bloodGroup?: string;
  complexion?: string;
  
  // Family Details
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  familyType?: 'Nuclear' | 'Joint';
  totalBrothers?: number;
  marriedBrothers?: number;
  totalSisters?: number;
  marriedSisters?: number;
  relativesInfo?: string;
  nativePlace?: string;
  
  // Lifestyle
  diet?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian';
  smoking?: 'Non-Smoker' | 'Smoker';
  drinking?: 'Non-Drinker' | 'Drinker';
  
  // Expectations & Contact
  partnerExpectations?: string;
  address?: string;

  createdAt: string;
  updatedAt: string;
}

export interface MatchPoolProfile extends Customer {
  compatibilityScore?: number;
}

export type MeetingType = 'Intro Call' | 'Follow-up' | 'Match Presentation' | 'Feedback Session' | 'Other';
export type MeetingMood = 'Very Positive' | 'Positive' | 'Neutral' | 'Mixed' | 'Negative';

export interface MeetingNote {
  id: string;
  customerId: string;
  date: string;
  type: MeetingType;
  duration: string; // e.g., "30 mins"
  mood: MeetingMood;
  summary: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}
