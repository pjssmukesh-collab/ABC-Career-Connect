from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.database import get_db
from app.models.admin import Admin
from app.models.student import Student
from app.models.recruiter import Recruiter
from app.models.drive import JobDrive
from app.models.application import Application
from app.models.notification import Notification
from app.schemas.admin import AdminLogin
from app.utils.hashing import verify_password, hash_password    
from pydantic import BaseModel      


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/login")
def admin_login(
    data: AdminLogin,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.email_id == data.email_id
    ).first()

    if not admin:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    # check hashed password
    if not verify_password(
        data.password,
        admin.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )
    return {
        "email_id": admin.email_id,
        "name": admin.name,
        "phone": admin.phone,
        "role": "Placement Administrator"
    }

class AdminProfileUpdate(BaseModel):
    name: str
    phone: str
    email_id: str

class AdminPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

@router.get("/profile")
def get_admin_profile(email_id: str, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email_id == email_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

@router.put("/profile")
def update_admin_profile(email_id: str, data: AdminProfileUpdate, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email_id == email_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    admin.name = data.name
    admin.phone = data.phone
    if data.email_id != admin.email_id:
        exists = db.query(Admin).filter(Admin.email_id == data.email_id).first()
        if exists:
            raise HTTPException(status_code=400, detail="Email already taken")
        admin.email_id = data.email_id
    db.commit()
    db.refresh(admin)
    return admin

@router.put("/change-password")
def change_admin_password(email_id: str, data: AdminPasswordUpdate, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email_id == email_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    if not verify_password(data.old_password, admin.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    if verify_password(data.new_password, admin.password):
        raise HTTPException(status_code=400, detail="New password must be different from old password")
    admin.password = hash_password(data.new_password)
    db.add(admin)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/students")
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students


@router.delete("/students/{roll_number}")
def delete_student(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": f"Student with roll number {roll_number} deleted successfully"}


class StudentUpdate(BaseModel):
    student_name: str
    email_id: str
    department: str
    year: str
    status: str
    cgpa: str | None = None
    sgpa_sem1: str | None = None
    sgpa_sem2: str | None = None
    sgpa_sem3: str | None = None
    sgpa_sem4: str | None = None
    sgpa_sem5: str | None = None
    sgpa_sem6: str | None = None
    sgpa_sem7: str | None = None
    sgpa_sem8: str | None = None
    linkedin_link: str | None = None
    github_profile: str | None = None
    resume: str | None = None
    backlogs: int | None = None
    phone: str | None = None
    gender: str | None = None
    dob: str | None = None
    address: str | None = None
    placement_status: str | None = None
    skills: str | None = None


@router.put("/students/{roll_number}")
def update_student(roll_number: str, data: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.student_name = data.student_name
    student.email_id = data.email_id
    student.department = data.department
    student.year = data.year
    student.status = data.status
    student.cgpa = data.cgpa
    student.sgpa_sem1 = data.sgpa_sem1
    student.sgpa_sem2 = data.sgpa_sem2
    student.sgpa_sem3 = data.sgpa_sem3
    student.sgpa_sem4 = data.sgpa_sem4
    student.sgpa_sem5 = data.sgpa_sem5
    student.sgpa_sem6 = data.sgpa_sem6
    student.sgpa_sem7 = data.sgpa_sem7
    student.sgpa_sem8 = data.sgpa_sem8
    student.linkedin_link = data.linkedin_link
    student.github_profile = data.github_profile
    student.resume = data.resume
    if data.backlogs is not None:
        student.backlogs = data.backlogs
    if data.phone is not None:
        student.phone = data.phone
    if data.gender is not None:
        student.gender = data.gender
    if data.dob is not None:
        student.dob = data.dob
    if data.address is not None:
        student.address = data.address
    if data.placement_status is not None:
        student.placement_status = data.placement_status
    if data.skills is not None:
        student.skills = data.skills
    db.commit()
    db.refresh(student)
    return student


@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    total_recruiters = db.query(Recruiter).count()
    total_companies = db.query(Recruiter.company_name).filter(Recruiter.company_name != None).distinct().count()
    total_job_drives = db.query(JobDrive).count()
    active_job_drives = db.query(JobDrive).filter(JobDrive.status == "Active").count()
    total_applications = db.query(Application).count()
    
    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_recruiters": total_recruiters,
        "total_job_drives": total_job_drives,
        "active_job_drives": active_job_drives,
        "total_applications": total_applications
    }

@router.get("/dashboard/recent-activity")
def get_recent_activity(db: Session = Depends(get_db)):
    recent_students = db.query(Student).order_by(Student.roll_number.desc()).limit(5).all()
    recent_recruiters = db.query(Recruiter).order_by(Recruiter.email_id.desc()).limit(5).all()
    
    recent_companies = []
    for r in recent_recruiters:
        recent_companies.append({
            "company_name": r.company_name or "Unknown",
            "industry": "Technology",
            "location": "Global / Remote",
            "recruiter_name": r.name or "-",
            "current_status": r.status or "Active"
        })

    recent_drives_query = db.query(JobDrive).order_by(JobDrive.id.desc()).limit(5).all()
    recent_drives = []
    for d in recent_drives_query:
        recent_drives.append({
            "company_name": d.company_name,
            "drive_date": d.drive_date,
            "registration_deadline": d.application_deadline,
            "minimum_cgpa": d.required_cgpa,
            "drive_status": d.status
        })

    recent_applications_query = db.query(Application).order_by(Application.id.desc()).limit(5).all()
    recent_applications = []
    for a in recent_applications_query:
        recent_applications.append({
            "student_name": a.student_name,
            "company_name": a.company_name,
            "applied_date": a.applied_date,
            "current_status": a.current_status
        })
        
    return {
        "recent_students": recent_students,
        "recent_companies": recent_companies,
        "recent_drives": recent_drives,
        "recent_applications": recent_applications
    }

# Companies endpoints
@router.get("/companies")
def get_all_companies(db: Session = Depends(get_db)):
    recruiters = db.query(Recruiter).all()
    companies = []
    for r in recruiters:
        companies.append({
            "id": r.email_id,
            "company_name": r.company_name or "Unknown",
            "industry": "Software & Tech",
            "recruiter_name": r.name or "-",
            "recruiter_email": r.email_id,
            "location": "Headquarters",
            "current_status": r.status or "Active"
        })
    return companies

@router.get("/companies/{company_id}")
def get_company(company_id: str, db: Session = Depends(get_db)):
    r = db.query(Recruiter).filter(Recruiter.email_id == company_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Company not found")
    return {
        "id": r.email_id,
        "company_name": r.company_name or "Unknown",
        "industry": "Information Technology",
        "recruiter_name": r.name or "-",
        "recruiter_email": r.email_id,
        "company_website": "https://company.example.com",
        "location": "Global",
        "current_status": r.status or "Active",
        "eligible_departments": "CSE, IT, ECE",
        "required_cgpa": "7.0",
        "allowed_backlogs": 0,
        "job_description": f"Campus hiring initiative by {r.company_name}."
    }

class CompanyCreate(BaseModel):
    company_name: str
    industry: str | None = None
    recruiter_name: str | None = None
    recruiter_email: str
    password: str
    location: str | None = None
    current_status: str | None = "Active"
    company_website: str | None = None
    eligible_departments: str | None = None
    required_cgpa: str | None = None
    allowed_backlogs: int | None = 0
    job_description: str | None = None
    logo: str | None = None

@router.post("/companies")
def create_company(data: CompanyCreate, db: Session = Depends(get_db)):
    exists = db.query(Recruiter).filter(Recruiter.email_id == data.recruiter_email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Company/Recruiter with this email already exists")
    
    new_recruiter = Recruiter(
        email_id=data.recruiter_email,
        password=data.password,
        company_name=data.company_name,
        name=data.recruiter_name,
        status=data.current_status or "Active"
    )
    db.add(new_recruiter)
    
    # Also add notification
    notif = Notification(
        message=f"New corporate partner {data.company_name} registered.",
        type="company_registered",
        recipient_role="admin"
    )
    db.add(notif)
    
    db.commit()
    db.refresh(new_recruiter)
    return {"message": "Company created successfully"}

class CompanyUpdate(BaseModel):
    company_name: str | None = None
    industry: str | None = None
    recruiter_name: str | None = None
    location: str | None = None
    current_status: str | None = None

@router.put("/companies/{company_id}")
def update_company(company_id: str, data: CompanyUpdate, db: Session = Depends(get_db)):
    r = db.query(Recruiter).filter(Recruiter.email_id == company_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Company not found")
    if data.company_name is not None:
        r.company_name = data.company_name
    if data.recruiter_name is not None:
        r.name = data.recruiter_name
    if data.current_status is not None:
        r.status = data.current_status
    db.commit()
    return {"message": "Company updated"}

@router.delete("/companies/{company_id}")
def delete_company(company_id: str, db: Session = Depends(get_db)):
    r = db.query(Recruiter).filter(Recruiter.email_id == company_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(r)
    db.commit()
    return {"message": "Company deleted"}


# ==========================================
# RECRUITERS ENDPOINTS
# ==========================================
class RecruiterCreate(BaseModel):
    name: str
    company_name: str
    email_id: str
    phone: str | None = None
    password: str
    status: str | None = "Active"

@router.get("/recruiters")
def get_all_recruiters(db: Session = Depends(get_db)):
    recruiters = db.query(Recruiter).all()
    return recruiters

@router.post("/recruiters")
def create_recruiter(data: RecruiterCreate, db: Session = Depends(get_db)):
    exists = db.query(Recruiter).filter(Recruiter.email_id == data.email_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Recruiter with this email already exists")
    recruiter = Recruiter(
        email_id=data.email_id,
        password=data.password,
        company_name=data.company_name,
        name=data.name,
        phone=data.phone,
        status=data.status or "Active"
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)
    return recruiter

@router.delete("/recruiters/{email_id}")
def delete_recruiter(email_id: str, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(recruiter)
    db.commit()
    return {"message": f"Recruiter {email_id} deleted successfully"}


# ==========================================
# REPORTS ENDPOINTS
# ==========================================
@router.get("/reports/students-by-department")
def get_students_by_dept(db: Session = Depends(get_db)):
    rows = db.query(Student.department, func.count(Student.roll_number)).group_by(Student.department).all()
    return [{"department": r[0] or "General", "count": r[1]} for r in rows]

@router.get("/reports/students-by-year")
def get_students_by_year(db: Session = Depends(get_db)):
    rows = db.query(Student.year, func.count(Student.roll_number)).group_by(Student.year).all()
    return [{"year": str(r[0]), "count": r[1]} for r in rows]

@router.get("/reports/placement-percentage")
def get_placement_percentage(db: Session = Depends(get_db)):
    total = db.query(Student).count()
    if total == 0:
        return {"total_students": 0, "placed_count": 0, "placed_percentage": 0.0}
    placed = db.query(Student).filter(
        (Student.placement_status == "Placed") | 
        (Student.placement_status == "Selected") | 
        (Student.offer_count > 0)
    ).count()
    pct = round((placed / total) * 100, 1)
    return {
        "total_students": total,
        "placed_count": placed,
        "placed_percentage": pct
    }

@router.get("/reports/company-wise-hiring")
def get_company_wise_hiring(db: Session = Depends(get_db)):
    rows = db.query(
        Application.company_name, 
        func.count(Application.id)
    ).filter(
        (Application.current_status == "Selected") | (Application.current_status == "Offer Released")
    ).group_by(Application.company_name).all()

    if not rows:
        companies = db.query(Recruiter.company_name).filter(Recruiter.company_name != None).distinct().all()
        return [{"company_name": c[0], "placed_count": 0} for c in companies]
    return [{"company_name": r[0], "placed_count": r[1]} for r in rows]

@router.get("/reports/applications-per-company")
def get_applications_per_company(db: Session = Depends(get_db)):
    rows = db.query(
        Application.company_name,
        func.count(Application.id)
    ).group_by(Application.company_name).all()
    if not rows:
        companies = db.query(Recruiter.company_name).filter(Recruiter.company_name != None).distinct().all()
        return [{"company_name": c[0], "applications_count": 0} for c in companies]
    return [{"company_name": r[0], "applications_count": r[1]} for r in rows]


# ==========================================
# NOTIFICATIONS ENDPOINTS
# ==========================================
@router.get("/notifications")
def get_all_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).order_by(Notification.id.desc()).all()
    return notifs

class NotificationCreate(BaseModel):
    message: str
    type: str = "general"
    recipient_role: str = "admin"
    recipient_id: str | None = None

@router.post("/notifications")
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    notif = Notification(
        message=data.message,
        type=data.type,
        recipient_role=data.recipient_role,
        recipient_id=data.recipient_id
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


# ==========================================
# JOB DRIVES ENDPOINTS
# ==========================================
class DriveCreate(BaseModel):
    company_name: str
    recruiter_email: str
    job_title: str
    role_type: str = "Full Time"
    ctc_package: str = "6.0 LPA"
    location: str = "Hybrid / On-site"
    eligible_departments: str = "CSE, IT, ECE"
    required_cgpa: str = "6.5"
    allowed_backlogs: int = 0
    job_description: str | None = None
    application_deadline: str
    drive_date: str
    status: str = "Active"

class DriveUpdate(BaseModel):
    job_title: str | None = None
    role_type: str | None = None
    ctc_package: str | None = None
    location: str | None = None
    eligible_departments: str | None = None
    required_cgpa: str | None = None
    allowed_backlogs: int | None = None
    job_description: str | None = None
    application_deadline: str | None = None
    drive_date: str | None = None
    status: str | None = None

@router.get("/drives")
def get_all_drives(db: Session = Depends(get_db)):
    drives = db.query(JobDrive).order_by(JobDrive.id.desc()).all()
    result = []
    for d in drives:
        app_count = db.query(Application).filter(Application.drive_id == d.id).count()
        result.append({
            "id": d.id,
            "company_name": d.company_name,
            "recruiter_email": d.recruiter_email,
            "job_title": d.job_title,
            "role_type": d.role_type,
            "ctc_package": d.ctc_package,
            "location": d.location,
            "eligible_departments": d.eligible_departments,
            "required_cgpa": d.required_cgpa,
            "allowed_backlogs": d.allowed_backlogs,
            "job_description": d.job_description,
            "application_deadline": d.application_deadline,
            "drive_date": d.drive_date,
            "status": d.status,
            "created_at": d.created_at,
            "applicants_count": app_count
        })
    return result

@router.get("/drives/{id}")
def get_drive(id: int, db: Session = Depends(get_db)):
    d = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Drive not found")
    app_count = db.query(Application).filter(Application.drive_id == d.id).count()
    return {
        "id": d.id,
        "company_name": d.company_name,
        "recruiter_email": d.recruiter_email,
        "job_title": d.job_title,
        "role_type": d.role_type,
        "ctc_package": d.ctc_package,
        "location": d.location,
        "eligible_departments": d.eligible_departments,
        "required_cgpa": d.required_cgpa,
        "allowed_backlogs": d.allowed_backlogs,
        "job_description": d.job_description,
        "application_deadline": d.application_deadline,
        "drive_date": d.drive_date,
        "status": d.status,
        "created_at": d.created_at,
        "applicants_count": app_count
    }

@router.post("/drives")
def create_drive(data: DriveCreate, db: Session = Depends(get_db)):
    drive = JobDrive(
        company_name=data.company_name,
        recruiter_email=data.recruiter_email,
        job_title=data.job_title,
        role_type=data.role_type,
        ctc_package=data.ctc_package,
        location=data.location,
        eligible_departments=data.eligible_departments,
        required_cgpa=data.required_cgpa,
        allowed_backlogs=data.allowed_backlogs,
        job_description=data.job_description,
        application_deadline=data.application_deadline,
        drive_date=data.drive_date,
        status=data.status
    )
    db.add(drive)
    
    # Add notification
    notif = Notification(
        message=f"New Campus Drive announced: {data.job_title} at {data.company_name} ({data.ctc_package}).",
        type="drive_created",
        recipient_role="all"
    )
    db.add(notif)
    
    db.commit()
    db.refresh(drive)
    return drive

@router.put("/drives/{id}")
def update_drive(id: int, data: DriveUpdate, db: Session = Depends(get_db)):
    d = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Drive not found")
    for field, val in data.dict(exclude_unset=True).items():
        setattr(d, field, val)
    db.commit()
    db.refresh(d)
    return d

@router.post("/drives/{id}/close")
def close_drive(id: int, db: Session = Depends(get_db)):
    d = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Drive not found")
    d.status = "Closed"
    db.commit()
    return {"message": "Drive closed successfully", "status": "Closed"}

@router.delete("/drives/{id}")
def delete_drive(id: int, db: Session = Depends(get_db)):
    d = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Drive not found")
    db.delete(d)
    db.commit()
    return {"message": "Drive deleted successfully"}


# ==========================================
# APPLICATIONS ENDPOINTS
# ==========================================
class ApplicationStatusUpdate(BaseModel):
    current_status: str
    notes: str | None = None

class ApplicationCreate(BaseModel):
    drive_id: int
    student_roll_number: str
    notes: str | None = None

@router.get("/applications")
def get_all_applications(db: Session = Depends(get_db)):
    apps = db.query(Application).order_by(Application.id.desc()).all()
    return apps

@router.post("/applications")
def create_application_admin(data: ApplicationCreate, db: Session = Depends(get_db)):
    drive = db.query(JobDrive).filter(JobDrive.id == data.drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    student = db.query(Student).filter(Student.roll_number == data.student_roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    existing = db.query(Application).filter(
        Application.drive_id == data.drive_id,
        Application.student_roll_number == data.student_roll_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student has already applied for this drive")

    app = Application(
        drive_id=drive.id,
        student_roll_number=student.roll_number,
        student_name=student.student_name,
        student_email=student.email_id,
        department=student.department,
        cgpa=student.cgpa,
        company_name=drive.company_name,
        job_title=drive.job_title,
        ctc_package=drive.ctc_package,
        current_status="Applied",
        notes=data.notes
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.put("/applications/{app_id}/status")
def update_application_status(app_id: int, data: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.current_status = data.current_status
    if data.notes:
        app.notes = data.notes

    if data.current_status in ["Selected", "Offer Released"]:
        student = db.query(Student).filter(Student.roll_number == app.student_roll_number).first()
        if student:
            student.placement_status = "Placed"
            student.offer_count = (student.offer_count or 0) + 1

    db.commit()
    db.refresh(app)
    return app
