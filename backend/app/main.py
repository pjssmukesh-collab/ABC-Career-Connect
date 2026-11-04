from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import admin, student, recruiter, drive, application, notification
from app.routes import (
    admin as admin_route,
    student as student_route,
    recruiter as recruiter_route,
    student_details as student_details_route,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow development clients to connect easily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# create tables
Base.metadata.create_all(bind=engine)


# routes
app.include_router(admin_route.router)
app.include_router(student_route.router)
app.include_router(recruiter_route.router)
app.include_router(student_details_route.router)


@app.get("/")
def home():
    return {
        "message":"Backend running"
    }