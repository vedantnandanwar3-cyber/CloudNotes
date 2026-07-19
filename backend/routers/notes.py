from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models.note import Note
from models.user import User
from schemas.note import NoteCreate
from security import verify_token

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = verify_token(credentials.credentials)

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    return user


@router.post("/")
def create_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_note = Note(
        title=note.title,
        content=note.content,
        user_id=current_user.id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "message": "Note created successfully"
    }


@router.get("/")
def get_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notes = db.query(Note).filter(
        Note.user_id == current_user.id
    ).all()

    return notes


@router.get("/search")
def search_notes(
    q: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notes = db.query(Note).filter(
        Note.user_id == current_user.id,
        Note.title.contains(q)
    ).all()

    return notes


@router.put("/{note_id}")
def update_note(
    note_id: int,
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing_note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not existing_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    existing_note.title = note.title
    existing_note.content = note.content

    db.commit()
    db.refresh(existing_note)

    return {
        "message": "Note updated successfully"
    }


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()   

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }