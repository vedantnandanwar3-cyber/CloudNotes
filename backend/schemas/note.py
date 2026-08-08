from pydantic import BaseModel, Field
from datetime import datetime


class NoteCreate(BaseModel):

    title: str = Field(
        min_length=3,
        max_length=100,
        description="Title of the note"
    )

    content: str = Field(
        min_length=1,
        max_length=5000,
        description="Content of the note"
    )

    color: str = "#ffffff"

    category: str = "General"


class NoteResponse(BaseModel):

    id: int

    title: str

    content: str

    color: str

    category: str

    is_pinned: bool

    created_at: datetime

    class Config:
        from_attributes = True