export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
export type CustomerStatus = 'Active' | 'Inactive' | 'Pending' | 'Archived';

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
