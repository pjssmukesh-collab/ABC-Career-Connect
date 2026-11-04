from sqlalchemy import Column, String, Integer, event
from app.database import Base
from app.utils.hashing import hash_password


class Student(Base):

    __tablename__ = "students"
    roll_number = Column(String, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    email_id = Column(String, nullable=False)
    department = Column(String, nullable=False)
    year = Column(String, nullable=False)
    status = Column(String, nullable=False)
    cgpa = Column(String, nullable=True)
    sgpa_sem1 = Column(String, nullable=True)
    sgpa_sem2 = Column(String, nullable=True)
    sgpa_sem3 = Column(String, nullable=True)
    sgpa_sem4 = Column(String, nullable=True)
    sgpa_sem5 = Column(String, nullable=True)
    sgpa_sem6 = Column(String, nullable=True)
    sgpa_sem7 = Column(String, nullable=True)
    sgpa_sem8 = Column(String, nullable=True)
    linkedin_link = Column(String, nullable=True)
    github_profile = Column(String, nullable=True)
    resume = Column(String, nullable=True)
    backlogs = Column(Integer, nullable=False, default=0)

    phone = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    address = Column(String, nullable=True)
    placement_status = Column(String, nullable=True, default="Eligible") # Eligible, Shortlisted, Selected, Placed, etc.
    skills = Column(String, nullable=True)
    projects = Column(String, nullable=True)
    certifications = Column(String, nullable=True)
    offer_count = Column(Integer, nullable=False, default=0)

@event.listens_for(Student,"before_insert")
def encrypt_password(
    mapper,
    connection,
    target
):

    target.password = hash_password(
        target.password
    )