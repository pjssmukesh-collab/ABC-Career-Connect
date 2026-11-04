from pydantic import BaseModel


# ---------- LOGIN ----------
class StudentLogin(BaseModel):
    roll_number: str
    password: str



# ---------- CREATE STUDENT ----------
class StudentCreate(BaseModel):
    student_name: str
    roll_number: str
    email_id: str
    department: str
    year: str
    status: str
    password: str
    cgpa: float | None = None
    sgpa_sem1: float | None = None
    sgpa_sem2: float | None = None
    sgpa_sem3: float | None = None
    sgpa_sem4: float | None = None
    sgpa_sem5: float | None = None
    sgpa_sem6: float | None = None
    sgpa_sem7: float | None = None
    sgpa_sem8: float | None = None
    linkedin_link: str | None = None
    github_profile: str | None = None
    resume: str | None = None
    backlogs: int | None = None

    class Config:
        from_attributes = True