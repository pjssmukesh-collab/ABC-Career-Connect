from pydantic import BaseModel

class RecruiterLogin(BaseModel):
    email_id: str
    password: str

class RecruiterCreate(BaseModel):
    email_id: str
    password: str
    company_name: str
    name: str
    phone: str
    Location: str
    Company_Website: str
    Recruiter_Name: str
    Industry: str
    Eligible_Departments: str
    Min_CGPA: str
    Max_Backlogs: str
    Job_Description: str

    class Config:
        orm_mode = True