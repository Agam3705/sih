// This file contains mock data for the user management page.
// It includes a diverse set of 1000 users to test filtering, search, and data visualization.

// Helper function to generate a random date within the last year
const randomDate = () => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Data pools for randomization
const names = [
  "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Gupta", "Arjun Patel", "Sai Reddy", "Reyansh Joshi", "Krishna Verma", "Ishaan Ali", "Rudra Iyer",
  "Anya Mehra", "Diya Choudhury", "Pari Das", "Saanvi Agarwal", "Myra Menon", "Aadhya Pillai", "Ananya Jain", "Kiara Bhat", "Riya Trivedi", "Siya Desai",
  "Advik Nair", "Kabir Shah", "Ansh Rao", "Ishaan Malhotra", "Aarush Kumar", "Dhruv Bansal", "Reyansh Reddy", "Ayaan Khan", "Yuvaan Mehta", "Atharv Sharma",
  "Shanaya Patel", "Zara Singh", "Navya Gupta", "Alia Kumar", "Gia Verma", "Ira Iyer", "Rhea Menon", "Zoya Ali", "Anika Jain", "Mahi Desai",
  "Arnav Choudhury", "Dev Mehra", "Parth Das", "Rohan Agarwal", "Samarth Pillai", "Veer Bhat", "Yash Trivedi", "Zain Khan", "Aditi Rao", "Ishita Malhotra",
  "Abhinav Reddy", "Adah Sharma", "Alok Verma", "Amrita Singh", "Anand Kumar", "Anjali Gupta", "Ankit Patel", "Anushka Iyer", "Arnav Mehra", "Avani Das",
  "Bhavya Agarwal", "Chetan Menon", "Deepak Pillai", "Divya Jain", "Esha Bhat", "Farhan Trivedi", "Gaurav Desai", "Geeta Nair", "Harsh Shah", "Heena Rao",
  "Imran Malhotra", "Isha Kumar", "Jai Bansal", "Juhi Reddy", "Karan Khan", "Kavita Mehta", "Kunal Sharma", "Lakshmi Patel", "Madhav Singh", "Manish Gupta",
  "Meera Kumar", "Mohit Verma", "Mukesh Iyer", "Naina Mehra", "Nakul Das", "Nandini Agarwal", "Neel Menon", "Neha Pillai", "Nikhil Jain", "Nisha Bhat",
  "Nitin Trivedi", "Pooja Desai", "Pranav Nair", "Preeti Shah", "Rahul Rao", "Raj Malhotra", "Rakesh Kumar", "Rani Bansal", "Ravi Reddy", "Reena Khan",
  "Rishi Mehta", "Ritika Sharma", "Rohit Patel", "Roshni Singh", "Sachin Gupta", "Sagar Kumar", "Sameer Verma", "Sandhya Iyer", "Sanjay Mehra", "Sarika Das",
  "Shankar Agarwal", "Shanti Menon", "Shreya Pillai", "Siddharth Jain", "Simran Bhat", "Sonia Trivedi", "Suresh Desai", "Sushma Nair", "Tanvi Shah", "Tarun Rao",
  "Uday Malhotra", "Uma Kumar", "Varun Bansal", "Vasudha Reddy", "Vedant Khan", "Vidya Mehta", "Vikram Sharma", "Vineet Patel", "Vinod Singh", "Vishal Gupta",
  // ... (This pattern continues for 1000 unique names)
  // To save space in this response, I'm providing a programmatic way to generate the rest
];

// Programmatically generate more names to reach 1000
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rudra", "Anya", "Diya", "Pari", "Saanvi", "Myra", "Aadhya", "Ananya", "Kiara", "Riya", "Siya", "Advik", "Kabir", "Ansh", "Aarush", "Dhruv", "Ayaan", "Yuvaan", "Atharv", "Shanaya", "Zara", "Navya", "Alia", "Gia", "Ira", "Rhea", "Zoya", "Anika", "Mahi", "Arnav", "Dev", "Parth", "Rohan", "Samarth", "Veer", "Yash", "Zain", "Aditi", "Ishita", "Abhinav", "Adah", "Alok", "Amrita", "Anand", "Anjali", "Ankit", "Anushka", "Avani", "Bhavya", "Chetan", "Deepak", "Divya", "Esha", "Farhan", "Gaurav", "Geeta", "Harsh", "Heena", "Imran", "Isha", "Jai", "Juhi", "Karan", "Kavita", "Kunal", "Lakshmi", "Madhav", "Manish", "Meera", "Mohit", "Mukesh", "Naina", "Nakul", "Nandini", "Neel", "Neha", "Nikhil", "Nisha", "Nitin", "Pooja", "Pranav", "Preeti", "Rahul", "Raj", "Rakesh", "Rani", "Ravi", "Reena", "Rishi", "Ritika", "Rohit", "Roshni", "Sachin", "Sagar", "Sameer", "Sandhya", "Sanjay", "Sarika", "Shankar", "Shanti", "Shreya", "Siddharth", "Simran", "Sonia", "Suresh", "Sushma", "Tanvi", "Tarun", "Uday", "Uma", "Varun", "Vasudha", "Vedant", "Vidya", "Vikram", "Vineet", "Vinod", "Vishal"];
const lastNames = ["Sharma", "Singh", "Kumar", "Gupta", "Patel", "Reddy", "Joshi", "Verma", "Ali", "Iyer", "Mehra", "Choudhury", "Das", "Agarwal", "Menon", "Pillai", "Jain", "Bhat", "Trivedi", "Desai", "Nair", "Shah", "Rao", "Malhotra", "Bansal", "Khan", "Mehta"];

while (names.length < 1000) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${randomFirstName} ${randomLastName}`;
    if (!names.includes(fullName)) {
        names.push(fullName);
    }
}


const educationalStatuses = ["Completed Class 10", "Completing Class 10 this year", "Completed Class 12", "Completing Class 12 this year", "Pursuing graduation", "Other"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science / IT", "History / Civics", "Geography", "Economics / Business Studies / Accountancy", "Languages & Literature", "Fine / Performing Arts", "Physical Education / Sports"];
const degrees = ["Engineering (BTech/BE)", "Medical (MBBS/BDS/Paramedical)", "Science (BSc/BCA etc.)", "Commerce (BCom/CA/CS/CFA etc.)", "Management (BBA/BMS etc.)", "Law (LLB/Integrated Law)", "Design/Fine Arts", "Humanities (BA/BSW etc.)", "Skilled Trades / Vocational", "Not sure yet"];
const careerFields = ["Engineering & Technology", "Medical & Healthcare", "Science & Research", "Business & Management", "Commerce, Banking & Finance", "Civil Services & Government", "Law & Legal Services", "Education & Teaching", "Creative Arts, Media & Design", "Social Work & Community"];
const exams = ["JEE Main/Advanced", "NEET", "CUET", "State engineering entrance", "CLAT (Law)", "Design (NIFT/NID/UCEED)", "Management (CAT/XAT/MAT)", "UPSC / State PSC", "None at present"];
const collegeFactors = ["Job placements", "College reputation / ranking", "Affordable fees / scholarships", "Location near home", "Curriculum & specializations", "Faculty quality"];
const incomes = ["Below ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000", "Prefer not to say"];
const skills = ["Problem-solving & analytical thinking", "Communication (verbal/written)", "Leadership & teamwork", "Creativity & innovation", "Technical / computer skills", "Research & analysis", "People skills & empathy"];
const challenges = ["Financial limitations", "Limited colleges nearby", "Family responsibilities", "Health issues", "No significant constraints"];

// Helper to get random items from an array
const getRandomItems = (arr, maxCount) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * maxCount) + 1);
};

export const mockUsers = names.slice(0, 1000).map((name, index) => {
    const firstName = name.split(' ')[0].toLowerCase();
    const email = `${firstName}.${index + 1}@example.com`;

    return {
        id: `user${String(index + 1).padStart(4, '0')}`,
        name: name,
        email: email,
        joinDate: randomDate(),
        isBlocked: index % 10 === 0, // Block every 10th user for variety
        quizAnswers: {
            "What is your current educational status?": educationalStatuses[Math.floor(Math.random() * educationalStatuses.length)],
            "Which subjects do you enjoy or perform well in?": getRandomItems(subjects, 3),
            "Which degree do you plan to pursue after Class 12?": degrees[Math.floor(Math.random() * degrees.length)],
            "Which career fields interest you the most?": getRandomItems(careerFields, 2),
            "What entrance exams are you planning to prepare for?": getRandomItems(exams, 2),
            "What factors matter most when choosing a college/course?": getRandomItems(collegeFactors, 2),
            "What is your family's monthly income range?": incomes[Math.floor(Math.random() * incomes.length)],
            "What are your strongest skills?": getRandomItems(skills, 3),
            "What constraints or challenges might affect your education?": getRandomItems(challenges, 1),
            "What are your long-term career goals?": index % 20 === 0 ? "To secure a leadership position in a multinational company." : "",
        }
    };
});