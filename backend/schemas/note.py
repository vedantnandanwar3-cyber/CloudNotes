from pydantic import BaseModel, Field


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


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        from_attributes = True