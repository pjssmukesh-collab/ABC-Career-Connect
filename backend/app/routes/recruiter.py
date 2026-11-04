from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.recruiter import Recruiter
from app.models.drive import JobDrive
from app.models.application import Application
from app.models.student import Student
from app.models.notification import Notification
from app.schemas.recruiter import RecruiterLogin
from app.utils.hashing import verify_password, hash_password

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"]
)


@router.post("/login")
def recruiter_login(
    data: RecruiterLogin,
    db: Session = Depends(get_db)
):
    recruiter = db.query(Recruiter).filter(
        Recruiter.email_id == data.email_id
    ).first()

    if recruiter is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, recruiter.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    return {
        "email_id": recruiter.email_id,
        "name": recruiter.name or "Recruiter",
        "company_name": recruiter.company_name or "Corporate Partner",
        "phone": recruiter.phone or "",
        "status": recruiter.status or "Active",
        "role": "recruiter"
    }


# ==========================================
# RECRUITER PROFILE ENDPOINTS
# ==========================================
class RecruiterProfileUpdate(BaseModel):
    name: str
    phone: str | None = None
    company_name: str | None = None

class RecruiterPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

@router.get("/profile")
def get_recruiter_profile(email_id: str, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return {
        "email_id": recruiter.email_id,
        "name": recruiter.name,
        "company_name": recruiter.company_name,
        "phone": recruiter.phone,
        "status": recruiter.status
    }

@router.put("/profile")
def update_recruiter_profile(email_id: str, data: RecruiterProfileUpdate, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    recruiter.name = data.name
    if data.phone is not None:
        recruiter.phone = data.phone
    if data.company_name is not None:
        recruiter.company_name = data.company_name
    db.commit()
    db.refresh(recruiter)
    return {
        "email_id": recruiter.email_id,
        "name": recruiter.name,
        "company_name": recruiter.company_name,
        "phone": recruiter.phone,
        "status": recruiter.status
    }

@router.put("/change-password")
def change_recruiter_password(email_id: str, data: RecruiterPasswordUpdate, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if not verify_password(data.old_password, recruiter.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    if verify_password(data.new_password, recruiter.password):
        raise HTTPException(status_code=400, detail="New password must be different from old password")
    recruiter.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# ==========================================
# RECRUITER DASHBOARD METRICS
# ==========================================
@router.get("/dashboard/stats")
def get_recruiter_dashboard_stats(email_id: str, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    company_name = recruiter.company_name if recruiter else None

    # Find drives belonging to this recruiter or company
    drives_query = db.query(JobDrive).filter(
        (JobDrive.recruiter_email == email_id) | (JobDrive.company_name == company_name)
    )
    total_drives = drives_query.count()
    active_drives = drives_query.filter(JobDrive.status == "Active").count()
    drive_ids = [d.id for d in drives_query.all()]

    apps_query = db.query(Application).filter(Application.drive_id.in_(drive_ids) if drive_ids else False)
    total_applicants = apps_query.count() if drive_ids else 0
    shortlisted_count = apps_query.filter(Application.current_status == "Shortlisted").count() if drive_ids else 0
    interviewed_count = apps_query.filter(Application.current_status == "Interviewed").count() if drive_ids else 0
    selected_count = apps_query.filter(
        (Application.current_status == "Selected") | (Application.current_status == "Offer Released")
    ).count() if drive_ids else 0

    return {
        "total_drives": total_drives,
        "active_drives": active_drives,
        "total_applicants": total_applicants,
        "shortlisted_count": shortlisted_count,
        "interviewed_count": interviewed_count,
        "selected_count": selected_count
    }


# ==========================================
# RECRUITER JOB DRIVES ENDPOINTS
# ==========================================
class RecruiterDriveCreate(BaseModel):
    job_title: str
    role_type: str = "Full Time"
    ctc_package: str = "8.0 LPA"
    location: str = "Hybrid / On-site"
    eligible_departments: str = "CSE, IT, ECE"
    required_cgpa: str = "7.0"
    allowed_backlogs: int = 0
    job_description: str | None = None
    application_deadline: str
    drive_date: str

class RecruiterDriveUpdate(BaseModel):
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
def get_recruiter_drives(email_id: str, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    company_name = recruiter.company_name if recruiter else None

    drives = db.query(JobDrive).filter(
        (JobDrive.recruiter_email == email_id) | (JobDrive.company_name == company_name)
    ).order_by(JobDrive.id.desc()).all()

    result = []
    for d in drives:
        count = db.query(Application).filter(Application.drive_id == d.id).count()
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
            "applicants_count": count
        })
    return result

@router.post("/drives")
def create_recruiter_drive(email_id: str, data: RecruiterDriveCreate, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter account not found")

    company_name = recruiter.company_name or "Corporate Partner"

    drive = JobDrive(
        company_name=company_name,
        recruiter_email=email_id,
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
        status="Active"
    )
    db.add(drive)

    notif = Notification(
        message=f"{company_name} launched a new recruitment drive for {data.job_title} ({data.ctc_package}).",
        type="drive_created",
        recipient_role="all"
    )
    db.add(notif)

    db.commit()
    db.refresh(drive)
    return drive

@router.put("/drives/{id}")
def update_recruiter_drive(id: int, data: RecruiterDriveUpdate, db: Session = Depends(get_db)):
    drive = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(drive, k, v)
    db.commit()
    db.refresh(drive)
    return drive

@router.post("/drives/{id}/close")
def close_recruiter_drive(id: int, db: Session = Depends(get_db)):
    drive = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    drive.status = "Closed"
    db.commit()
    return {"message": "Drive marked as Closed", "status": "Closed"}

@router.delete("/drives/{id}")
def delete_recruiter_drive(id: int, db: Session = Depends(get_db)):
    drive = db.query(JobDrive).filter(JobDrive.id == id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    db.delete(drive)
    db.commit()
    return {"message": "Drive deleted"}


# ==========================================
# RECRUITER APPLICANTS MANAGEMENT
# ==========================================
class CandidateStatusUpdate(BaseModel):
    current_status: str # Shortlisted, Interviewed, Selected, Rejected
    notes: str | None = None

@router.get("/applicants")
def get_recruiter_applicants(email_id: str, drive_id: Optional[int] = None, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.email_id == email_id).first()
    company_name = recruiter.company_name if recruiter else None

    # Get drives belonging to this recruiter
    drives = db.query(JobDrive).filter(
        (JobDrive.recruiter_email == email_id) | (JobDrive.company_name == company_name)
    ).all()
    drive_ids = [d.id for d in drives]

    if not drive_ids:
        return []

    query = db.query(Application).filter(Application.drive_id.in_(drive_ids))
    if drive_id:
        query = query.filter(Application.drive_id == drive_id)

    applications = query.order_by(Application.id.desc()).all()

    # Join or attach student details (resume link, linkedin, etc.)
    result = []
    for app in applications:
        student = db.query(Student).filter(Student.roll_number == app.student_roll_number).first()
        result.append({
            "id": app.id,
            "drive_id": app.drive_id,
            "student_roll_number": app.student_roll_number,
            "student_name": app.student_name,
            "student_email": app.student_email,
            "department": app.department,
            "cgpa": app.cgpa,
            "company_name": app.company_name,
            "job_title": app.job_title,
            "ctc_package": app.ctc_package,
            "current_status": app.current_status,
            "applied_date": app.applied_date,
            "notes": app.notes,
            "resume": student.resume if student else None,
            "linkedin_link": student.linkedin_link if student else None,
            "github_profile": student.github_profile if student else None,
            "phone": student.phone if student else None,
            "backlogs": student.backlogs if student else 0,
            "skills": student.skills if student else None
        })
    return result

@router.put("/applicants/{id}/status")
def update_candidate_status(id: int, data: CandidateStatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.current_status = data.current_status
    if data.notes:
        app.notes = data.notes

    # If selected, update student status and offer count
    if data.current_status in ["Selected", "Offer Released"]:
        student = db.query(Student).filter(Student.roll_number == app.student_roll_number).first()
        if student:
            student.placement_status = "Placed"
            student.offer_count = (student.offer_count or 0) + 1

    # Add notification for student and admin
    notif = Notification(
        message=f"Application update: {app.student_name} ({app.student_roll_number}) status changed to '{data.current_status}' for {app.company_name} - {app.job_title}.",
        type="status_updated",
        recipient_role="all",
        recipient_id=app.student_roll_number
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return app
