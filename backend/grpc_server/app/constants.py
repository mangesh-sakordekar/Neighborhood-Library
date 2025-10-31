"""Centralized constants and messages."""
import os

DEFAULT_GRPC_PORT = int(os.getenv('GRPC_PORT', 50051))

MSG_BOOK_NOT_FOUND = "Book not found"
MSG_BOOK_NOT_AVAILABLE = "Book not available"
MSG_BORROWING_NOT_FOUND = "Borrowing record not found"
MSG_MEMBER_NOT_FOUND = "Member not found"
MSG_CANNOT_DELETE_BORROWED = "Cannot delete a borrowed book"
MSG_CANNOT_DELETE_MEMBER_WITH_BORROWED = "Cannot delete member with borrowed books"
