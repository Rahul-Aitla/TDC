const firstNamesMale = ["Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Ishaan", "Aaryan", "Aavush", "Kabir", "Aayaan", "Vivaan", "Krishna", "Advait", "Aryan", "Reyansh"];
const firstNamesFemale = ["Ananya", "Diya", "Saanvi", "Aavushi", "Myra", "Aaradhya", "Anika", "Ira", "Navya", "Anya", "Kyra", "Ishani", "Siya", "Riya", "Sanya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Kapoor", "Khan", "Patel", "Reddy", "Iyer", "Nair", "Singh", "Joshi", "Mehta", "Chopra", "Aggarwal"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow"];
const colleges = ["IIT Bombay", "IIT Delhi", "BITS Pilani", "IIM Ahmedabad", "Delhi University", "Anna University", "SRM Institute", "Manipal Academy", "St. Stephens", "NMIMS"];
const companies = ["Google", "Microsoft", "TATA Consultancy Services", "Infosys", "Reliance Industries", "Zomato", "Flipkart", "HDFC Bank", "ICICI Bank", "Amazon"];
const designations = ["Software Engineer", "Product Manager", "Data Scientist", "Marketing Manager", "Business Analyst", "Consultant", "HR Manager", "Operations Lead"];
const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Parsi"];
const castes = ["Brahmin", "Kshatriya", "Vaishya", "Kayastha", "Sunni", "Shia", "Jat", "Maratha"];
const hobbiesList = ["Reading", "Traveling", "Cooking", "Photography", "Yoga", "Trekking", "Gardening", "Painting", "Music", "Cricket"];
const traitsList = ["Ambitious", "Kind", "Extrovert", "Introvert", "Caring", "Funny", "Intelligent", "Honest", "Optimistic", "Calm"];
const languagesList = ["Hindi", "English", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Punjabi", "Malayalam"];

const rashis = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha"];
const complexions = ["Fair", "Wheatish", "Dark", "Very Fair"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const diets = ["Vegetarian", "Non-Vegetarian", "Eggetarian"];
const customerStatuses = [
  "Profile Created", 
  "Verification Pending", 
  "Verified", 
  "Intro Call Scheduled", 
  "Intro Call Completed", 
  "Match Suggestions Generated", 
  "Matches Sent", 
  "Feedback Awaiting", 
  "Meeting Scheduled", 
  "Active Search", 
  "Successfully Matched", 
  "On Hold"
];
const membershipTiers = ["Premium", "Standard"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, size) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

function generateCustomer(id, isMatchPool = false) {
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const firstName = gender === 'Male' ? getRandom(firstNamesMale) : getRandom(firstNamesFemale);
  const lastName = getRandom(lastNames);
  const age = Math.floor(Math.random() * (45 - 22 + 1)) + 22;
  const year = 2026 - age;
  const dob = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  
  return {
    id,
    firstName,
    lastName,
    gender,
    age,
    dateOfBirth: dob,
    city: getRandom(cities),
    country: "India",
    height: `${Math.floor(Math.random() * (6 - 5 + 1)) + 5}'${Math.floor(Math.random() * 12)}"`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    college: getRandom(colleges),
    degree: Math.random() > 0.4 ? "B.Tech" : "MBA",
    income: `${Math.floor(Math.random() * (50 - 10 + 1)) + 10} LPA`,
    company: getRandom(companies),
    designation: getRandom(designations),
    maritalStatus: (() => {
      const rand = Math.random();
      if (rand > 0.85) return 'Divorced';
      if (rand > 0.95) return gender === 'Male' ? 'Widower' : 'Widow';
      return 'Unmarried';
    })(),
    membershipTier: getRandom(membershipTiers),
    languages: getRandomSubset(languagesList, 2),
    religion: getRandom(religions),
    caste: getRandom(castes),
    siblings: Math.floor(Math.random() * 3),
    wantKids: Math.random() > 0.2,
    openToRelocate: Math.random() > 0.5,
    openToPets: Math.random() > 0.5,
    hobbies: getRandomSubset(hobbiesList, 3),
    personalityTraits: getRandomSubset(traitsList, 3),
    status: getRandom(customerStatuses),
    profileVerified: Math.random() > 0.3,

    // New Fields
    timeOfBirth: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    placeOfBirth: getRandom(cities),
    subcaste: "None",
    horoscopeDetails: "Kundali match preferred",
    rashi: getRandom(rashis),
    nakshatra: getRandom(nakshatras),
    manglik: Math.random() > 0.8,
    weight: `${Math.floor(Math.random() * (90 - 50 + 1)) + 50} kg`,
    bloodGroup: getRandom(bloodGroups),
    complexion: getRandom(complexions),
    
    fatherName: `Mr. ${getRandom(firstNamesMale)} ${lastName}`,
    fatherOccupation: "Businessman",
    motherName: `Mrs. ${getRandom(firstNamesFemale)} ${lastName}`,
    motherOccupation: "Homemaker",
    familyType: Math.random() > 0.7 ? "Joint" : "Nuclear",
    totalBrothers: Math.floor(Math.random() * 2),
    marriedBrothers: 0,
    totalSisters: Math.floor(Math.random() * 2),
    marriedSisters: 0,
    relativesInfo: "Well settled in India and abroad",
    nativePlace: getRandom(cities),
    
    diet: getRandom(diets),
    smoking: "Non-Smoker",
    drinking: "Non-Drinker",
    
    partnerExpectations: "Looking for a well-educated and family-oriented partner who values mutual respect and growth.",
    address: `Street ${Math.floor(Math.random() * 100)}, ${getRandom(cities)}, India`,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

const activeCustomers = Array.from({ length: 20 }, (_, i) => generateCustomer(`CUST-${i + 1}`));
const matchPool = Array.from({ length: 100 }, (_, i) => generateCustomer(`POOL-${i + 1}`, true));

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'mock_data.json');
fs.writeFileSync(dataPath, JSON.stringify({ activeCustomers, matchPool }, null, 2), 'utf8');
console.log(`Successfully generated ${dataPath}`);
