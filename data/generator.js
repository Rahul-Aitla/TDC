const firstNamesMale = ["Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Ishaan", "Aaryan", "Aavush", "Kabir", "Ayaan", "Vivaan", "Krishna", "Advait", "Aryan", "Reyansh"];
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
    maritalStatus: "Never Married",
    languages: getRandomSubset(languagesList, 2),
    religion: getRandom(religions),
    caste: getRandom(castes),
    siblings: Math.floor(Math.random() * 3),
    wantKids: Math.random() > 0.2,
    openToRelocate: Math.random() > 0.5,
    openToPets: Math.random() > 0.5,
    hobbies: getRandomSubset(hobbiesList, 3),
    personalityTraits: getRandomSubset(traitsList, 3),
    status: isMatchPool ? 'Active' : 'Active',
    profileVerified: Math.random() > 0.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

const activeCustomers = Array.from({ length: 20 }, (_, i) => generateCustomer(`CUST-${i + 1}`));
const matchPool = Array.from({ length: 100 }, (_, i) => generateCustomer(`POOL-${i + 1}`, true));

console.log(JSON.stringify({ activeCustomers, matchPool }, null, 2));
