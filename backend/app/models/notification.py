from sqlalchemy import Column, String, Integer
from datetime import datetime
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False, default="general") # student_added, company_registered, drive_created, application_submitted, status_updated
    recipient_role = Column(String, nullable=False, default="admin") # admin, recruiter, student, all
    recipient_id = Column(String, nullable=True) # roll number or email if targeted
    created_at = Column(String, nullable=False, default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M"))

