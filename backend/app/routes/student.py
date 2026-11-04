from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.student import Student
from app.models.drive import JobDrive
from app.models.application import Application
from app.models.notification import Notification
from app.schemas.student import StudentLogin
from app.utils.hashing import verify_password, hash_password

router = APIRouter(
    prefix="/student",
    tags=["Student"]
)


@router.post("/login")
def student_login(
    data: StudentLogin,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.roll_number == data.roll_number
    ).first()

    if student is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid roll number or password"
        )

    if not verify_password(data.password, student.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid roll number or password"
        )

    return {
        "roll_number": student.roll_number,
        "student_name": student.student_name,
        "email_id": student.email_id,
        "department": student.department,
        "year": student.year,
        "cgpa": student.cgpa,
        "placement_status": student.placement_status or "Eligible",
        "offer_count": student.offer_count or 0,
        "role": "student"
    }


# ==========================================
# STUDENT PROFILE ENDPOINTS
# ==========================================
class StudentProfileUpdate(BaseModel):
    student_name: Optional[str] = None
    email_id: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    address: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    cgpa: Optional[str] = None
    sgpa_sem1: Optional[str] = None
    sgpa_sem2: Optional[str] = None
    sgpa_sem3: Optional[str] = None
    sgpa_sem4: Optional[str] = None
    sgpa_sem5: Optional[str] = None
    sgpa_sem6: Optional[str] = None
    sgpa_sem7: Optional[str] = None
    sgpa_sem8: Optional[str] = None
    backlogs: Optional[int] = None
    skills: Optional[str] = None
    resume: Optional[str] = None
    linkedin_link: Optional[str] = None
    github_profile: Optional[str] = None

class StudentPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

@router.get("/profile")
def get_student_profile(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    return student

@router.put("/profile")
def update_student_profile(roll_number: str, data: StudentProfileUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    for k, v in data.dict(exclude_unset=True).items():
        if v is not None:
            setattr(student, k, v)

    db.commit()
    db.refresh(student)
    return student

@router.put("/change-password")
def change_student_password(roll_number: str, data: StudentPasswordUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    if not verify_password(data.old_password, student.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    if verify_password(data.new_password, student.password):
        raise HTTPException(status_code=400, detail="New password must be different from old password")
    student.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# ==========================================
# STUDENT DASHBOARD METRICS
# ==========================================
@router.get("/dashboard/stats")
def get_student_dashboard_stats(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    active_drives = db.query(JobDrive).filter(JobDrive.status == "Active").all()
    student_cgpa = float(student.cgpa) if student.cgpa and student.cgpa.replace('.', '', 1).isdigit() else 0.0
    student_backlogs = student.backlogs or 0
    student_dept = (student.department or "").strip().upper()

    eligible_count = 0
    for d in active_drives:
        req_cgpa = float(d.required_cgpa) if d.required_cgpa and d.required_cgpa.replace('.', '', 1).isdigit() else 0.0
        allowed_backlogs = d.allowed_backlogs or 0
        dept_match = ("ALL" in d.eligible_departments.upper()) or (student_dept in [dept.strip().upper() for dept in d.eligible_departments.split(",")])
        
        if dept_match and (student_cgpa >= req_cgpa) and (student_backlogs <= allowed_backlogs):
            eligible_count += 1

    applications = db.query(Application).filter(Application.student_roll_number == roll_number).all()
    applications_count = len(applications)
    shortlisted_count = len([a for a in applications if a.current_status in ["Shortlisted", "Interviewed"]])
    offers_count = len([a for a in applications if a.current_status in ["Selected", "Offer Released"]])

    return {
        "active_drives_count": len(active_drives),
        "eligible_drives_count": eligible_count,
        "applications_count": applications_count,
        "shortlisted_count": shortlisted_count,
        "offers_count": offers_count,
        "placement_status": student.placement_status or "Eligible"
    }


# ==========================================
# STUDENT CAMPUS DRIVES ENDPOINTS
# ==========================================
@router.get("/drives")
def get_student_drives(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    student_cgpa = float(student.cgpa) if student.cgpa and student.cgpa.replace('.', '', 1).isdigit() else 0.0
    student_backlogs = student.backlogs or 0
    student_dept = (student.department or "").strip().upper()

    # Get student's current applications map: drive_id -> Application
    applications = db.query(Application).filter(Application.student_roll_number == roll_number).all()
    app_map = {a.drive_id: a for a in applications}

    drives = db.query(JobDrive).filter(JobDrive.status == "Active").order_by(JobDrive.id.desc()).all()
    result = []

    for d in drives:
        req_cgpa = float(d.required_cgpa) if d.required_cgpa and d.required_cgpa.replace('.', '', 1).isdigit() else 0.0
        allowed_backlogs = d.allowed_backlogs or 0
        depts = [dept.strip().upper() for dept in d.eligible_departments.split(",")]
        dept_match = ("ALL" in d.eligible_departments.upper()) or (student_dept in depts)

        is_eligible = True
        reasons = []

        if not dept_match:
            is_eligible = False
            reasons.append(f"Department {student_dept} not eligible (Required: {d.eligible_departments})")
        if student_cgpa < req_cgpa:
            is_eligible = False
            reasons.append(f"CGPA {student_cgpa} below required {req_cgpa}")
        if student_backlogs > allowed_backlogs:
            is_eligible = False
            reasons.append(f"Backlogs ({student_backlogs}) exceed allowed ({allowed_backlogs})")

        has_applied = d.id in app_map
        app_status = app_map[d.id].current_status if has_applied else None

        result.append({
            "id": d.id,
            "company_name": d.company_name,
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
            "is_eligible": is_eligible,
            "eligibility_reason": "; ".join(reasons) if not is_eligible else "Eligible to apply",
            "has_applied": has_applied,
            "application_status": app_status
        })

    return result


# ==========================================
# STUDENT APPLY FOR DRIVE
# ==========================================
class StudentApplyRequest(BaseModel):
    roll_number: str
    drive_id: int
    notes: Optional[str] = None

@router.post("/apply")
def student_apply(data: StudentApplyRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == data.roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    drive = db.query(JobDrive).filter(JobDrive.id == data.drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Job drive not found")

    if drive.status != "Active":
        raise HTTPException(status_code=400, detail="This recruitment drive is closed for applications")

    # Check if already applied
    existing = db.query(Application).filter(
        Application.drive_id == drive.id,
        Application.student_roll_number == student.roll_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this position")

    # Check eligibility
    student_cgpa = float(student.cgpa) if student.cgpa and student.cgpa.replace('.', '', 1).isdigit() else 0.0
    req_cgpa = float(drive.required_cgpa) if drive.required_cgpa and drive.required_cgpa.replace('.', '', 1).isdigit() else 0.0
    student_dept = (student.department or "").strip().upper()
    depts = [dept.strip().upper() for dept in drive.eligible_departments.split(",")]
    dept_match = ("ALL" in drive.eligible_departments.upper()) or (student_dept in depts)

    if not dept_match:
        raise HTTPException(status_code=400, detail=f"Your department ({student_dept}) is not eligible for this role.")
    if student_cgpa < req_cgpa:
        raise HTTPException(status_code=400, detail=f"Your CGPA ({student_cgpa}) does not meet the minimum requirement ({req_cgpa}).")
    if (student.backlogs or 0) > (drive.allowed_backlogs or 0):
        raise HTTPException(status_code=400, detail=f"Your active backlogs exceed the allowed limit ({drive.allowed_backlogs}).")

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

    # Add notification
    notif = Notification(
        message=f"Application submitted: {student.student_name} ({student.roll_number}) applied for {drive.company_name} - {drive.job_title}.",
        type="application_submitted",
        recipient_role="all"
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return {"message": "Application submitted successfully!", "application_id": app.id}


# ==========================================
# STUDENT APPLICATIONS LIST
# ==========================================
@router.get("/applications")
def get_student_applications(roll_number: str, db: Session = Depends(get_db)):
    applications = db.query(Application).filter(
        Application.student_roll_number == roll_number
    ).order_by(Application.id.desc()).all()

    result = []
    for app in applications:
        drive = db.query(JobDrive).filter(JobDrive.id == app.drive_id).first()
        result.append({
            "id": app.id,
            "drive_id": app.drive_id,
            "company_name": app.company_name,
            "job_title": app.job_title,
            "ctc_package": app.ctc_package or (drive.ctc_package if drive else "-"),
            "location": drive.location if drive else "On-site",
            "drive_date": drive.drive_date if drive else "-",
            "application_deadline": drive.application_deadline if drive else "-",
            "current_status": app.current_status,
            "applied_date": app.applied_date,
            "notes": app.notes
        })
    return result
