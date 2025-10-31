from datetime import datetime
import pytest
from app.services import book_service

def test_create_book(test_db, sample_book_data):
    book = book_service.create_book(test_db, **sample_book_data)
    assert book.title == sample_book_data["title"]
    assert book.author == sample_book_data["author"]
    assert book.available == True
    assert isinstance(book.created_at, datetime)

def test_list_books(test_db, sample_book_data):
    # Create some test books
    book1 = book_service.create_book(test_db, **sample_book_data)
    book2 = book_service.create_book(test_db, title="Book 2", author="Author 2")
    
    # Test listing all books
    books = book_service.list_books(test_db)
    assert len(books) == 2
    assert books[0].id == book1.id
    assert books[1].id == book2.id

    # Test listing only available books
    book1.available = False
    test_db.commit()
    available_books = book_service.list_books(test_db, only_available=True)
    assert len(available_books) == 1
    assert available_books[0].id == book2.id

def test_update_book(test_db, sample_book_data):
    book = book_service.create_book(test_db, **sample_book_data)
    updated = book_service.update_book(test_db, book, "New Title", "New Author")
    assert updated.title == "New Title"
    assert updated.author == "New Author"
    assert updated.id == book.id

def test_delete_book(test_db, sample_book_data):
    book = book_service.create_book(test_db, **sample_book_data)
    book_service.delete_book(test_db, book)
    assert book_service.get_book(test_db, book.id) is None