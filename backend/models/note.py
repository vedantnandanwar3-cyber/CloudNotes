from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    content = Column(Text)

    is_pinned = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))