from app.database import SessionLocal, Base, engine
from app.models.admin import Admin
from app.models.student import Student
from app.models.recruiter import Recruiter
from app.models.drive import JobDrive
from app.models.application import Application
from app.models.notification import Notification
from app.utils.hashing import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("Clearing existing seed data for clean initialization...")
db.query(Application).delete()
db.query(JobDrive).delete()
db.query(Notification).delete()
db.query(Student).delete()
db.query(Recruiter).delete()
db.query(Admin).delete()
db.commit()

# 1. ADMIN
admin = Admin(
    email_id="mukesh@gmail.com",
    password="mukesh@123",
    name="Placement Administrator",
    phone="9876543210"
)
db.add(admin)

# 2. RECRUITERS
recruiters_data = [
    {
        "email_id": "google@gmail.com",
        "password": "google@123",
        "company_name": "Google",
        "name": "Sarah Jenkins",
        "phone": "9811223344",
        "status": "Active"
    },
    {
        "email_id": "microsoft@gmail.com",
        "password": "microsoft@123",
        "company_name": "Microsoft",
        "name": "David Miller",
        "phone": "9822334455",
        "status": "Active"
    },
    {
        "email_id": "amazon@gmail.com",
        "password": "amazon@123",
        "company_name": "Amazon",
        "name": "Pooja Hegde",
        "phone": "9833445566",
        "status": "Active"
    },
    {
        "email_id": "tcs@gmail.com",
        "password": "tcs@123",
        "company_name": "TCS",
        "name": "Rajesh Kumar",
        "phone": "9844556677",
        "status": "Active"
    },
    {
        "email_id": "infosys@gmail.com",
        "password": "infosys@123",
        "company_name": "Infosys",
        "name": "Anita Rao",
        "phone": "9855667788",
        "status": "Active"
    }
]

for r in recruiters_data:
    recruiter = Recruiter(**r)
    db.add(recruiter)

# 3. STUDENTS
students_data = [
    {
        "roll_number": "23331A05D3",
        "student_name": "Vamsi Krishna",
        "password": "student@123",
        "email_id": "vamsi@college.edu",
        "department": "CSE",
        "year": "4",
        "status": "Active",
        "cgpa": "9.2",
        "sgpa_sem1": "8.9",
        "sgpa_sem2": "9.0",
        "sgpa_sem3": "9.1",
        "sgpa_sem4": "9.3",
        "sgpa_sem5": "9.2",
        "sgpa_sem6": "9.4",
        "sgpa_sem7": "9.3",
        "sgpa_sem8": "9.5",
        "linkedin_link": "https://linkedin.com/in/vamsi-krishna",
        "github_profile": "https://github.com/vamsikrishna",
        "resume": "https://drive.google.com/file/d/vamsi_resume/view",
        "backlogs": 0,
        "phone": "9876543210",
        "gender": "Male",
        "dob": "2003-05-14",
        "address": "Hyderabad, Telangana",
        "placement_status": "Placed",
        "skills": "React, Node.js, Python, SQL, Docker, AWS",
        "projects": "Campus Placement Portal, AI Resume Screener",
        "certifications": "AWS Certified Cloud Practitioner",
        "offer_count": 1
    },
    {
        "roll_number": "23331A05D4",
        "student_name": "Rahul Verma",
        "password": "student@123",
        "email_id": "rahul@college.edu",
        "department": "CSE",
        "year": "4",
        "status": "Active",
        "cgpa": "8.4",
        "sgpa_sem1": "8.0",
        "sgpa_sem2": "8.2",
        "sgpa_sem3": "8.4",
        "sgpa_sem4": "8.5",
        "sgpa_sem5": "8.3",
        "sgpa_sem6": "8.6",
        "sgpa_sem7": "8.7",
        "sgpa_sem8": "8.5",
        "linkedin_link": "https://linkedin.com/in/rahul-verma",
        "github_profile": "https://github.com/rahulverma",
        "resume": "https://drive.google.com/file/d/rahul_resume/view",
        "backlogs": 0,
        "phone": "9876543211",
        "gender": "Male",
        "dob": "2003-08-20",
        "address": "Visakhapatnam, Andhra Pradesh",
        "placement_status": "Placed",
        "skills": "Java, Spring Boot, MySQL, Microservices, Git",
        "projects": "Banking Backend API, Inventory Manager",
        "certifications": "Oracle Certified Java Associate",
        "offer_count": 1
    },
    {
        "roll_number": "23331A05D5",
        "student_name": "Mukesh Kumar",
        "password": "student@123",
        "email_id": "mukesh.std@college.edu",
        "department": "CSE",
        "year": "4",
        "status": "Active",
        "cgpa": "7.8",
        "sgpa_sem1": "7.5",
        "sgpa_sem2": "7.6",
        "sgpa_sem3": "7.8",
        "sgpa_sem4": "7.9",
        "sgpa_sem5": "7.7",
        "sgpa_sem6": "8.0",
        "sgpa_sem7": "8.1",
        "sgpa_sem8": "7.9",
        "linkedin_link": "https://linkedin.com/in/mukesh-kumar-std",
        "github_profile": "https://github.com/mukeshkumar",
        "resume": "https://drive.google.com/file/d/mukesh_resume/view",
        "backlogs": 0,
        "phone": "9876543212",
        "gender": "Male",
        "dob": "2003-11-02",
        "address": "Vijayawada, Andhra Pradesh",
        "placement_status": "Eligible",
        "skills": "Python, FastAPI, Django, PostgreSQL, HTML/CSS",
        "projects": "E-Commerce Web App, Realtime Chat Application",
        "certifications": "Python for Data Science",
        "offer_count": 0
    },
    {
        "roll_number": "23331A05D6",
        "student_name": "Durga Prasad",
        "password": "student@123",
        "email_id": "durga@college.edu",
        "department": "ECE",
        "year": "4",
        "status": "Active",
        "cgpa": "6.8",
        "sgpa_sem1": "6.5",
        "sgpa_sem2": "6.6",
        "sgpa_sem3": "6.7",
        "sgpa_sem4": "7.0",
        "sgpa_sem5": "6.8",
        "sgpa_sem6": "6.9",
        "sgpa_sem7": "7.1",
        "sgpa_sem8": "7.0",
        "linkedin_link": "https://linkedin.com/in/durga-prasad",
        "github_profile": "https://github.com/durgaprasad",
        "resume": "https://drive.google.com/file/d/durga_resume/view",
        "backlogs": 0,
        "phone": "9876543213",
        "gender": "Male",
        "dob": "2003-02-18",
        "address": "Guntur, Andhra Pradesh",
        "placement_status": "Eligible",
        "skills": "Embedded C, IoT, Arduino, Verilog, Python",
        "projects": "Smart Agricultural Monitoring, Home Automation",
        "certifications": "IoT Fundamentals",
        "offer_count": 0
    },
    {
        "roll_number": "23331A05D7",
        "student_name": "Priya Sharma",
        "password": "student@123",
        "email_id": "priya@college.edu",
        "department": "IT",
        "year": "4",
        "status": "Active",
        "cgpa": "8.9",
        "sgpa_sem1": "8.7",
        "sgpa_sem2": "8.8",
        "sgpa_sem3": "8.9",
        "sgpa_sem4": "9.0",
        "sgpa_sem5": "8.8",
        "sgpa_sem6": "9.1",
        "sgpa_sem7": "9.0",
        "sgpa_sem8": "9.2",
        "linkedin_link": "https://linkedin.com/in/priya-sharma",
        "github_profile": "https://github.com/priyasharma",
        "resume": "https://drive.google.com/file/d/priya_resume/view",
        "backlogs": 0,
        "phone": "9876543214",
        "gender": "Female",
        "dob": "2003-07-25",
        "address": "Bengaluru, Karnataka",
        "placement_status": "Eligible",
        "skills": "TypeScript, React, Next.js, Node.js, MongoDB, AWS",
        "projects": "Healthcare Appointment Portal, Task Tracker",
        "certifications": "AWS Certified Developer",
        "offer_count": 0
    },
    {
        "roll_number": "23331A05D8",
        "student_name": "Ananya Reddy",
        "password": "student@123",
        "email_id": "ananya@college.edu",
        "department": "CSE",
        "year": "4",
        "status": "Active",
        "cgpa": "9.5",
        "sgpa_sem1": "9.4",
        "sgpa_sem2": "9.5",
        "sgpa_sem3": "9.6",
        "sgpa_sem4": "9.5",
        "sgpa_sem5": "9.6",
        "sgpa_sem6": "9.7",
        "sgpa_sem7": "9.5",
        "sgpa_sem8": "9.8",
        "linkedin_link": "https://linkedin.com/in/ananya-reddy",
        "github_profile": "https://github.com/ananyareddy",
        "resume": "https://drive.google.com/file/d/ananya_resume/view",
        "backlogs": 0,
        "phone": "9876543215",
        "gender": "Female",
        "dob": "2003-09-12",
        "address": "Hyderabad, Telangana",
        "placement_status": "Eligible",
        "skills": "Deep Learning, PyTorch, Python, Computer Vision, C++",
        "projects": "Autonomous Vehicle Perception, Medical Image Classifier",
        "certifications": "DeepLearning.AI Specialization",
        "offer_count": 0
    }
]

for s in students_data:
    student = Student(**s)
    db.add(student)

db.commit()

# 4. JOB DRIVES
drives_data = [
    {
        "company_name": "Google",
        "recruiter_email": "google@gmail.com",
        "job_title": "Software Development Engineer (SDE-1)",
        "role_type": "Full Time",
        "ctc_package": "28.5 LPA",
        "location": "Bengaluru / Hyderabad",
        "eligible_departments": "CSE, IT, ECE",
        "required_cgpa": "8.0",
        "allowed_backlogs": 0,
        "job_description": "Join Google's engineering team to design, build, and deploy high-scale distributed systems impacting billions of global users.",
        "application_deadline": "2026-11-25",
        "drive_date": "2026-12-02",
        "status": "Active"
    },
    {
        "company_name": "Microsoft",
        "recruiter_email": "microsoft@gmail.com",
        "job_title": "Cloud Solutions Associate",
        "role_type": "Full Time",
        "ctc_package": "22.0 LPA",
        "location": "Hyderabad / Remote",
        "eligible_departments": "CSE, IT",
        "required_cgpa": "7.5",
        "allowed_backlogs": 0,
        "job_description": "Help enterprise customers architect cloud-native solutions on Azure. Proficiency in networking, microservices, and databases preferred.",
        "application_deadline": "2026-11-28",
        "drive_date": "2026-12-05",
        "status": "Active"
    },
    {
        "company_name": "Amazon",
        "recruiter_email": "amazon@gmail.com",
        "job_title": "Cloud Support & DevOps Engineer",
        "role_type": "Full Time",
        "ctc_package": "16.0 LPA",
        "location": "Bengaluru",
        "eligible_departments": "All",
        "required_cgpa": "7.0",
        "allowed_backlogs": 1,
        "job_description": "Provide deep technical troubleshooting and architecture consultation for AWS cloud services, infrastructure automation, and CI/CD pipelines.",
        "application_deadline": "2026-11-30",
        "drive_date": "2026-12-10",
        "status": "Active"
    },
    {
        "company_name": "TCS",
        "recruiter_email": "tcs@gmail.com",
        "job_title": "Digital Software Engineer",
        "role_type": "Full Time",
        "ctc_package": "9.0 LPA",
        "location": "Pan-India",
        "eligible_departments": "All",
        "required_cgpa": "6.5",
        "allowed_backlogs": 0,
        "job_description": "Work across enterprise software engineering, full-stack application development, modern cloud architectures, and digital transformation.",
        "application_deadline": "2026-11-20",
        "drive_date": "2026-11-27",
        "status": "Active"
    },
    {
        "company_name": "Infosys",
        "recruiter_email": "infosys@gmail.com",
        "job_title": "Specialist Programmer",
        "role_type": "Full Time",
        "ctc_package": "9.5 LPA",
        "location": "Bengaluru / Pune",
        "eligible_departments": "CSE, IT, ECE",
        "required_cgpa": "6.5",
        "allowed_backlogs": 1,
        "job_description": "High-impact coding role requiring solid foundation in algorithms, system design, data structures, and polyglot programming.",
        "application_deadline": "2026-12-01",
        "drive_date": "2026-12-08",
        "status": "Active"
    }
]

created_drives = []
for d in drives_data:
    drive = JobDrive(**d)
    db.add(drive)
    created_drives.append(drive)

db.commit()

# Refresh drives to get IDs
for d in created_drives:
    db.refresh(d)

google_drive = created_drives[0]
msft_drive = created_drives[1]
amazon_drive = created_drives[2]
tcs_drive = created_drives[3]
infosys_drive = created_drives[4]

# 5. APPLICATIONS
applications_data = [
    {
        "drive_id": google_drive.id,
        "student_roll_number": "23331A05D3",
        "student_name": "Vamsi Krishna",
        "student_email": "vamsi@college.edu",
        "department": "CSE",
        "cgpa": "9.2",
        "company_name": "Google",
        "job_title": "Software Development Engineer (SDE-1)",
        "ctc_package": "28.5 LPA",
        "current_status": "Shortlisted",
        "applied_date": "2026-11-01",
        "notes": "Excellent algorithmic interview round 1."
    },
    {
        "drive_id": tcs_drive.id,
        "student_roll_number": "23331A05D3",
        "student_name": "Vamsi Krishna",
        "student_email": "vamsi@college.edu",
        "department": "CSE",
        "cgpa": "9.2",
        "company_name": "TCS",
        "job_title": "Digital Software Engineer",
        "ctc_package": "9.0 LPA",
        "current_status": "Selected",
        "applied_date": "2026-10-25",
        "notes": "Offer letter dispatched."
    },
    {
        "drive_id": msft_drive.id,
        "student_roll_number": "23331A05D4",
        "student_name": "Rahul Verma",
        "student_email": "rahul@college.edu",
        "department": "CSE",
        "cgpa": "8.4",
        "company_name": "Microsoft",
        "job_title": "Cloud Solutions Associate",
        "ctc_package": "22.0 LPA",
        "current_status": "Interviewed",
        "applied_date": "2026-11-02",
        "notes": "Technical round completed, awaiting hiring manager review."
    },
    {
        "drive_id": tcs_drive.id,
        "student_roll_number": "23331A05D4",
        "student_name": "Rahul Verma",
        "student_email": "rahul@college.edu",
        "department": "CSE",
        "cgpa": "8.4",
        "company_name": "TCS",
        "job_title": "Digital Software Engineer",
        "ctc_package": "9.0 LPA",
        "current_status": "Selected",
        "applied_date": "2026-10-25",
        "notes": "Offer accepted."
    },
    {
        "drive_id": amazon_drive.id,
        "student_roll_number": "23331A05D7",
        "student_name": "Priya Sharma",
        "student_email": "priya@college.edu",
        "department": "IT",
        "cgpa": "8.9",
        "company_name": "Amazon",
        "job_title": "Cloud Support & DevOps Engineer",
        "ctc_package": "16.0 LPA",
        "current_status": "Shortlisted",
        "applied_date": "2026-11-02",
        "notes": "Online assessment cleared."
    },
    {
        "drive_id": infosys_drive.id,
        "student_roll_number": "23331A05D5",
        "student_name": "Mukesh Kumar",
        "student_email": "mukesh.std@college.edu",
        "department": "CSE",
        "cgpa": "7.8",
        "company_name": "Infosys",
        "job_title": "Specialist Programmer",
        "ctc_package": "9.5 LPA",
        "current_status": "Applied",
        "applied_date": "2026-11-03",
        "notes": "Application submitted."
    }
]

for a in applications_data:
    app = Application(**a)
    db.add(app)

# 6. NOTIFICATIONS
notifications_data = [
    {
        "message": "Campus recruitment season 2026 officially launched with 5 marquee partners.",
        "type": "general",
        "recipient_role": "all"
    },
    {
        "message": "Google announced SDE-1 drive with package of 28.5 LPA.",
        "type": "drive_created",
        "recipient_role": "all"
    },
    {
        "message": "Microsoft announced Cloud Solutions Associate drive (22.0 LPA).",
        "type": "drive_created",
        "recipient_role": "all"
    },
    {
        "message": "Vamsi Krishna (23331A05D3) received an offer letter from TCS Digital.",
        "type": "status_updated",
        "recipient_role": "admin"
    },
    {
        "message": "Rahul Verma (23331A05D4) received an offer letter from TCS Digital.",
        "type": "status_updated",
        "recipient_role": "admin"
    }
]

for n in notifications_data:
    notif = Notification(**n)
    db.add(notif)

db.commit()
db.close()
print("Rich seed data inserted successfully!")
