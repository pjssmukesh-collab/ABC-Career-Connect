from sqlalchemy import Column, String,event
from app.database import Base
from app.utils.hashing import hash_password

class Recruiter(Base):
    __tablename__ = "Recruiters"
    email_id = Column(String,primary_key=True,index=True)
    password = Column(String,nullable=False)
    company_name = Column(String, nullable=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    status = Column(String, nullable=True, default="Active")
    
@event.listens_for(Recruiter, "before_insert")
def encrypt_password(
    mapper,
    connection,
    target
):

    target.password = hash_password(
        target.password
    )