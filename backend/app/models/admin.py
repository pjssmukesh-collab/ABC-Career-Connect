from sqlalchemy import Column, String, event
from app.database import Base
from app.utils.hashing import hash_password

class Admin(Base):
    __tablename__ = "Admins"
    email_id = Column(String,primary_key=True,index=True)
    password = Column(String,nullable=False)
    name = Column(String, nullable=True, default="Placement Administrator")
    phone = Column(String, nullable=True, default="9999999999")



@event.listens_for(Admin, "before_insert")
def encrypt_password(
    mapper,
    connection,
    target
):

    target.password = hash_password(
        target.password
    )
    
    