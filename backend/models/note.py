from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from database import Base
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    content = Column(Text)

    is_pinned = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    color = Column(String, default="#ffffff")