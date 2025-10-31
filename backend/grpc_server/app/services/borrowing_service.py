from sqlalchemy.orm import Session
from app.models import Borrowing, Book
from app.logging_config import logger
from datetime import datetime, UTC

def borrow_book(db: Session, book: Book, member_id: int):
    if not book.available:
        return None
    book.available = False
    borrowing = Borrowing(book_id=book.id, member_id=member_id, borrowed_at=datetime.now(UTC))
    db.add(borrowing)
    try:
        db.commit()
        db.refresh(borrowing)
        logger.info("Book borrowed", extra={"book_id": book.id, "borrowing_id": borrowing.id})
        return borrowing
    except Exception:
        db.rollback()
        logger.exception("Failed to create borrowing record")
        raise

def list_current_borrowings(db: Session):
    return (
        db.query(Borrowing)
        .join(Book, Borrowing.book_id == Book.id)
        .filter(Borrowing.returned_at == None)
        .order_by(Borrowing.id)
        .all()
    )

def return_borrowing(db: Session, borrowing, return_time=None):
    borrowing.returned_at = return_time or datetime.now(UTC)
    borrowing.book.available = True
    try:
        db.commit()
        db.refresh(borrowing)
        return borrowing
    except Exception:
        db.rollback()
        raise
