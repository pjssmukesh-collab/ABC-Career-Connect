from sqlalchemy import Column, String, Integer, Float, DateTime
from datetime import datetime
from app.database import Base

class JobDrive(Base):
    __tablename__ = "job_drives"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String, nullable=False, index=True)
    recruiter_email = Column(String, nullable=False, index=True)
    job_title = Column(String, nullable=False)
    role_type = Column(String, nullable=False, default="Full Time") # Full Time, Internship, etc.
    ctc_package = Column(String, nullable=False, default="6.0 LPA")
    location = Column(String, nullable=True, default="Hybrid / On-site")
    eligible_departments = Column(String, nullable=False, default="CSE, IT, ECE")
    required_cgpa = Column(String, nullable=False, default="6.5")
    allowed_backlogs = Column(Integer, nullable=False, default=0)
    job_description = Column(String, nullable=True)
    application_deadline = Column(String, nullable=False)
    drive_date = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Active") # Active, Closed
    created_at = Column(String, nullable=False, default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M"))

