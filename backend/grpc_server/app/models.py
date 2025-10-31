from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, UniqueConstraint, Index
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, UTC

# add timestamps and unique constraints

Base = declarative_base()

class Book(Base):
    __tablename__ = "books"
    __table_args__ = (UniqueConstraint('title', 'author', name='uq_books_title_author'),)

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    borrowings = relationship("Borrowing", back_populates="book")

class Borrowing(Base):
    __tablename__ = "borrowings"
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    member_id = Column(Integer, ForeignKey("members.id"))
    borrowed_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    book = relationship("Book", back_populates="borrowings")
    member = relationship("Member", back_populates="borrowings")

class Member(Base):
    __tablename__ = "members"
    __table_args__ = (UniqueConstraint('contact', name='uq_members_contact'),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    borrowings = relationship("Borrowing", back_populates="member")

# helpful indexes
Index('ix_books_title', Book.title)
Index('ix_members_contact', Member.contact)