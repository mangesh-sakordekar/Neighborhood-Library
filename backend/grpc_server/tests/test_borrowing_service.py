from datetime import datetime, timedelta
import pytest
from app.services import borrowing_service, book_service, member_service

@pytest.fixture
def test_book(test_db, sample_book_data):
    return book_service.create_book(test_db, **sample_book_data)

@pytest.fixture
def test_member(test_db, sample_member_data):
    return member_service.create_member(test_db, **sample_member_data)

def test_borrow_book(test_db, test_book, test_member):
    # Borrow a book
    borrowing = borrowing_service.borrow_book(test_db, test_book, test_member.id)
    assert borrowing.book_id == test_book.id
    assert borrowing.member_id == test_member.id
    assert borrowing.returned_at is None
    assert isinstance(borrowing.borrowed_at, datetime)
    
    # Verify book is no longer available
    updated_book = book_service.get_book(test_db, test_book.id)
    assert not updated_book.available

def test_return_book(test_db, test_book, test_member):
    # Setup: borrow a book
    borrowing = borrowing_service.borrow_book(test_db, test_book, test_member.id)
    
    # Return the book
    returned = borrowing_service.return_borrowing(test_db, borrowing)
    assert isinstance(returned.returned_at, datetime)
    
    # Verify book is available again
    updated_book = book_service.get_book(test_db, test_book.id)
    assert updated_book.available

def test_list_current_borrowings(test_db, test_book, test_member):
    # Create one current and one returned borrowing
    borrowing1 = borrowing_service.borrow_book(test_db, test_book, test_member.id)
    
    # Create another book and borrow it
    book2 = book_service.create_book(test_db, title="Book 2", author="Author 2")
    borrowing2 = borrowing_service.borrow_book(test_db, book2, test_member.id)
    
    # Return the second book
    borrowing_service.return_borrowing(test_db, borrowing2)
    
    # List current borrowings - should only see the first one
    current = borrowing_service.list_current_borrowings(test_db)
    assert len(current) == 1
    assert current[0].id == borrowing1.id