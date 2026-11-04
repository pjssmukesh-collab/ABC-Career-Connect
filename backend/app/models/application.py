from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    drive_id = Column(Integer, nullable=False, index=True)
    student_roll_number = Column(String, nullable=False, index=True)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    department = Column(String, nullable=False)
    cgpa = Column(String, nullable=True)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    ctc_package = Column(String, nullable=True)
    current_status = Column(String, nullable=False, default="Applied") # Applied, Shortlisted, Interviewed, Selected, Rejected
    applied_date = Column(String, nullable=False, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    notes = Column(String, nullable=True)

