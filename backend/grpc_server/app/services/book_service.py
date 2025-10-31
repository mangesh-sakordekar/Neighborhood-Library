from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.models import Book
from app.logging_config import logger

def create_book(db: Session, title: str, author: str) -> Book:
    book = Book(title=title.strip(), author=author.strip())
    db.add(book)
    try:
        db.commit()
        db.refresh(book)
        logger.info("Created book", extra={"book_id": book.id, "title": book.title})
        return book
    except IntegrityError as e:
        db.rollback()
        logger.exception("Failed to create book", exc_info=e)
        raise

def list_books(db: Session, only_available: bool = False):
    q = db.query(Book)
    if only_available:
        q = q.filter(Book.available == True)
    return q.order_by(Book.id).all()

def get_book(db: Session, book_id: int):
    return db.query(Book).filter(Book.id == book_id).first()

def update_book(db: Session, book: Book, title: str, author: str):
    book.title = title
    book.author = author
    try:
        db.commit()
        db.refresh(book)
        return book
    except Exception:
        db.rollback()
        raise

def delete_book(db: Session, book: Book):
    db.delete(book)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise
