from fastapi import (APIRouter,UploadFile,File,Depends,HTTPException)
from sqlalchemy.orm import Session
import pandas as pd
from app.database import get_db
from app.models.student import Student

router = APIRouter(
    prefix="/student",
    tags=["Student"]
)

def clean_val(val):
    if pd.isna(val) or val is None:
        return ""
    # If float and represents an integer (like 4.0)
    if isinstance(val, float):
        if val.is_integer():
            return str(int(val))
        return str(val)
    return str(val).strip()


@router.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filename = (
        file.filename or ""
    ).lower()

    # check file type
    if not filename.endswith(
        (
            ".xlsx",
            ".xls",
            ".csv"
        )
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "Only Excel or CSV files allowed"
        )

    try:
        # READ FILE
        if filename.endswith(".csv"):
            df = pd.read_csv(
                file.file
            )
        else:
            df = pd.read_excel(
                file.file
            )

        # NORMALIZE COLUMN NAMES
        df.columns = (
            df.columns
            .str.strip()
            .str.lower()
            .str.replace(" ","_")
        )

        # ACCEPT DIFFERENT FORMATS
        df.rename(
            columns={
                "student_name": "student_name",
                
                "roll_number": "roll_number",

                "email": "email_id",
   
                "department": "department",

                "year": "year",

                "password": "password",

                "linkedin_link": "linkedin_link",

                "github_link": "github_profile",
                
                "cgpa": "cgpa",
                
                "sem1": "sgpa_sem1",

                "sem2": "sgpa_sem2",

                "sem3": "sgpa_sem3",
                
                "sem4": "sgpa_sem4",

                "sem5": "sgpa_sem5",

                "sem6": "sgpa_sem6",
                
                "sem7": "sgpa_sem7",

                "sem8": "sgpa_sem8",
                
                "backlogs": "backlogs"
                

            },
            inplace=True
        )
        
        # REQUIRED COLUMNS
        required = [
            "student_name",
            "roll_number",
            "email_id",
            "department",
            "year",
            "password"
        ]
        for col in required:
            if col not in df.columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing column: {col}"
                )

        count = 0
        for _, row in df.iterrows():
            roll_no = clean_val(row["roll_number"])
            if not roll_no:
                continue  # skip rows with empty roll number

            # duplicate check
            existing = db.query(
                Student
            ).filter(
                Student.roll_number == roll_no
            ).first()
            if existing:
                continue

            student = Student(
                student_name = clean_val(row["student_name"]),
                roll_number = roll_no,
                email_id = clean_val(row["email_id"]),
                department = clean_val(row["department"]),
                year = clean_val(row["year"]),
                status = clean_val(row.get("status", "Active")) or "Active",
                password = clean_val(row["password"]),
                cgpa = clean_val(row.get("cgpa")) or None,
                sgpa_sem1 = clean_val(row.get("sgpa_sem1")) or None,
                sgpa_sem2 = clean_val(row.get("sgpa_sem2")) or None,
                sgpa_sem3 = clean_val(row.get("sgpa_sem3")) or None,
                sgpa_sem4 = clean_val(row.get("sgpa_sem4")) or None,
                sgpa_sem5 = clean_val(row.get("sgpa_sem5")) or None,
                sgpa_sem6 = clean_val(row.get("sgpa_sem6")) or None,
                sgpa_sem7 = clean_val(row.get("sgpa_sem7")) or None,
                sgpa_sem8 = clean_val(row.get("sgpa_sem8")) or None,
                linkedin_link = clean_val(row.get("linkedin_link")) or None,
                github_profile = clean_val(row.get("github_profile")) or None,
                resume = clean_val(row.get("resume")) or None,
                backlogs = int(clean_val(row.get("backlogs")) or 0),
            )
            db.add(student)
            count += 1
        db.commit()
        
        return {
            "message": "Students uploaded successfully",
            "students_added": count
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
        