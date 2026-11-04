from pydantic import BaseModel

class AdminLogin(BaseModel):
    email_id: str
    password: str

    class Config:
        orm_mode = True