from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    available = Column(Boolean, default=True)
    borrowings = relationship("Borrowing", back_populates="book")

class Borrowing(Base):
    __tablename__ = "borrowings"
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    member_id = Column(Integer, ForeignKey("members.id"))
    borrowed_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime)
    book = relationship("Book", back_populates="borrowings")
    member = relationship("Member", back_populates="borrowings")

class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    borrowings = relationship("Borrowing", back_populates="member")