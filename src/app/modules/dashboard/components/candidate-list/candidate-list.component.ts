import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent {
list = [
  {
    "Name": "John Doe",
    "Email": "johndoe@example.com",
    "Mobile": "1234567890",
    "Current": "Tech Innovations Inc.",
    "Previous": "Creative Solutions Ltd.",
    "Experience": "5 years",
    "current": 75000,
    "Education": "Bachelor's in Computer Science",
    "Skills": "JavaScript, React, Node.js",
    "Soft Skills": ["teamwork", "communication", "problem-solving"]
  },
  {
    "Name": "Jane Smith",
    "Email": "janesmith@example.com",
    "Mobile": "9876543210",
    "Current": "Data Analytics Corp.",
    "Previous": "Insightful Data Inc.",
    "Experience": "3 years",
    "current": 68000,
    "Education": "Master's in Computer Science",
    "Skills": "Python, SQL, Machine Learning",
    "Soft Skills": ["analytical thinking", "critical thinking", "adaptability"]
  },
  {
    "Name": "Michael Johnson",
    "Email": "michaelj@example.com",
    "Mobile": "5556667777",
    "Current": "Global Marketing Solutions",
    "Previous": "Brand Power Ltd.",
    "Experience": "4 years",
    "current": 72000,
    "Education": "Bachelor's in Marketing",
    "Skills": "SEO, Digital Marketing, Content Creation",
    "Soft Skills": ["creativity", "strategic thinking", "persuasion"]
  },
  {
    "Name": "Emily Davis",
    "Email": "emilyd@example.com",
    "Mobile": "2223334444",
    "Current": "Innovative Designs Co.",
    "Previous": "Creative Minds Agency",
    "Experience": "6 years",
    "current": 80000,
    "Education": "Bachelor's in Graphic Design",
    "Skills": "Adobe Creative Suite, UI/UX, Web Design",
    "Soft Skills": ["creativity", "attention to detail", "time management"]
  },
  {
    "Name": "David Wilson",
    "Email": "davidw@example.com",
    "Mobile": "1112223333",
    "Current": "Software Solutions Ltd.",
    "Previous": "Efficient Code Inc.",
    "Experience": "7 years",
    "current": 85000,
    "Education": "Master's in Software Engineering",
    "Skills": "C++, Java, System Design",
    "Soft Skills": ["logical thinking", "team leadership", "communication"]
  },
  {
    "Name": "Olivia Lee",
    "Email": "olivial@example.com",
    "Mobile": "4445556666",
    "Current": "Enterprise Cloud Services",
    "Previous": "Cloud Tech Innovations",
    "Experience": "2 years",
    "current": 65000,
    "Education": "Bachelor's in Information Technology",
    "Skills": "Cloud Computing, AWS, Azure",
    "Soft Skills": ["adaptability", "collaboration", "self-motivation"]
  },
  {
    "Name": "William Brown",
    "Email": "williamb@example.com",
    "Mobile": "7778889999",
    "Current": "Global Finance Group",
    "Previous": "Investment Banking Solutions",
    "Experience": "8 years",
    "current": 92000,
    "Education": "Master's in Finance",
    "Skills": "Financial Analysis, Excel, Portfolio Management",
    "Soft Skills": ["analytical skills", "detail-oriented", "decision making"]
  },
  {
    "Name": "Sophia Martinez",
    "Email": "sophiam@example.com",
    "Mobile": "6667778888",
    "Current": "Healthcare Innovations Inc.",
    "Previous": "Life Science Solutions Ltd.",
    "Experience": "3 years",
    "current": 70000,
    "Education": "Bachelor's in Biology",
    "Skills": "Laboratory Techniques, Research, Data Analysis",
    "Soft Skills": ["teamwork", "communication", "critical thinking"]
  },
  {
    "Name": "James Garcia",
    "Email": "jamesg@example.com",
    "Mobile": "8889990000",
    "Current": "Engineering Solutions LLC",
    "Previous": "Advanced Engineering Group",
    "Experience": "5 years",
    "current": 78000,
    "Education": "Bachelor's in Mechanical Engineering",
    "Skills": "CAD, CAM, Prototyping",
    "Soft Skills": ["problem-solving", "innovation", "attention to detail"]
  }
]

}
