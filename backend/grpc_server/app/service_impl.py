import generated.library_pb2 as library_pb2
import generated.library_pb2_grpc as library_pb2_grpc
from app.database import SessionLocal
from app.models import Book, Member, Borrowing
import grpc
from datetime import datetime
from google.protobuf import empty_pb2
from app import validators
from app.services import book_service, member_service, borrowing_service
from app.logging_config import logger
from app import constants

class LibraryServiceImpl(library_pb2_grpc.LibraryServiceServicer):
    def CreateBook(self, request, context):
        try:
            validators.validate_required_str('title', request.title)
            validators.validate_required_str('author', request.author)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return library_pb2.Book()

        db = SessionLocal()
        try:
            book = book_service.create_book(db, request.title, request.author)
            return library_pb2.Book(id=book.id, title=book.title, author=book.author, available=book.available)
        except Exception as e:
            logger.exception("CreateBook failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return library_pb2.Book()
        finally:
            db.close()

    def ListBooks(self, request, context):
        db = SessionLocal()
        try:
            books = book_service.list_books(db, only_available=False)
            return library_pb2.BookList(books=[
                library_pb2.Book(id=b.id, title=b.title, author=b.author, available=b.available)
                for b in books
            ])
        finally:
            db.close()
    
    def ListAvailableBooks(self, request, context):
        db = SessionLocal()
        try:
            books = book_service.list_books(db, only_available=True)
            return library_pb2.BookList(books=[
                library_pb2.Book(id=b.id, title=b.title, author=b.author, available=b.available)
                for b in books
            ])
        finally:
            db.close()

    def BorrowBook(self, request, context):
        try:
            validators.validate_positive_int('book_id', request.book_id)
            validators.validate_positive_int('member_id', request.member_id)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return library_pb2.Empty()

        db = SessionLocal()
        try:
            book = book_service.get_book(db, request.book_id)
            if not book or not book.available:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_BOOK_NOT_AVAILABLE)
                return library_pb2.Empty()
            borrowing = borrowing_service.borrow_book(db, book, request.member_id)
            return library_pb2.Empty()
        except Exception as e:
            logger.exception("BorrowBook failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return library_pb2.Empty()
        finally:
            db.close()

    
    #  Add Member
    def AddMember(self, request, context):
        try:
            validators.validate_required_str('name', request.name)
            validators.validate_required_str('contact', request.contact)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return library_pb2.Member()

        db = SessionLocal()
        try:
            member = member_service.create_member(db, request.name, request.contact)
            return library_pb2.Member(id=member.id, name=member.name, contact=member.contact)
        except Exception as e:
            logger.exception("AddMember failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return library_pb2.Member()
        finally:
            db.close()

    # List Members
    def ListMembers(self, request, context):
        db = SessionLocal()
        try:
            members = member_service.list_members(db)
            return library_pb2.MemberList(members=[
                library_pb2.Member(id=m.id, name=m.name, contact=m.contact) for m in members
            ])
        finally:
            db.close()
    
    def ListBorrowedBooks(self, request, context):
        db = SessionLocal()
        try:
            borrowings = borrowing_service.list_current_borrowings(db)
            borrowed_books = []
            for b in borrowings:
                borrowed_books.append(
                    library_pb2.BorrowedBook(
                        borrowing_id=b.id,
                        book_id=b.book.id,
                        book_title=b.book.title,
                        member_id=b.member.id,
                        member_name=b.member.name,
                        borrowing_date=b.borrowed_at.strftime("%Y-%m-%d %H:%M:%S")[:10],
                    )
                )
            return library_pb2.BorrowedBooksResponse(borrowed_books=borrowed_books)
        finally:
            db.close()

    def ReturnBook(self, request, context):
        try:
            validators.validate_positive_int('borrowing_id', request.borrowing_id)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return empty_pb2.Empty()

        db = SessionLocal()
        try:
            borrowing = db.query(Borrowing).filter(Borrowing.id == request.borrowing_id).first()
            if not borrowing:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_BORROWING_NOT_FOUND)
                return empty_pb2.Empty()
            borrowing_service.return_borrowing(db, borrowing)
            return empty_pb2.Empty()
        except Exception as e:
            logger.exception("ReturnBook failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return empty_pb2.Empty()
        finally:
            db.close()
    
    # Update Book
    def UpdateBook(self, request, context):
        try:
            validators.validate_positive_int('id', request.id)
            validators.validate_required_str('title', request.title)
            validators.validate_required_str('author', request.author)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return library_pb2.Book()

        db = SessionLocal()
        try:
            book = book_service.get_book(db, request.id)
            if not book:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_BOOK_NOT_FOUND)
                return library_pb2.Book()
            updated = book_service.update_book(db, book, request.title, request.author)
            return library_pb2.Book(id=updated.id, title=updated.title, author=updated.author, available=updated.available)
        except Exception as e:
            logger.exception("UpdateBook failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return library_pb2.Book()
        finally:
            db.close()

    # Delete Book
    def DeleteBook(self, request, context):
        try:
            validators.validate_positive_int('id', request.id)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return empty_pb2.Empty()

        db = SessionLocal()
        try:
            book = book_service.get_book(db, request.id)
            if not book:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_BOOK_NOT_FOUND)
                return empty_pb2.Empty()
            if not book.available:
                context.set_code(grpc.StatusCode.FAILED_PRECONDITION)
                context.set_details(constants.MSG_CANNOT_DELETE_BORROWED)
                return empty_pb2.Empty()
            book_service.delete_book(db, book)
            return empty_pb2.Empty()
        except Exception as e:
            logger.exception("DeleteBook failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return empty_pb2.Empty()
        finally:
            db.close()
    
    # --- Update Member ---
    def UpdateMember(self, request, context):
        try:
            validators.validate_positive_int('id', request.id)
            validators.validate_required_str('name', request.name)
            validators.validate_required_str('contact', request.contact)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return library_pb2.Member()

        db = SessionLocal()
        try:
            member = member_service.get_member(db, request.id)
            if not member:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_MEMBER_NOT_FOUND)
                return library_pb2.Member()
            updated = member_service.update_member(db, member, request.name, request.contact)
            return library_pb2.Member(id=updated.id, name=updated.name, contact=updated.contact)
        except Exception as e:
            logger.exception("UpdateMember failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return library_pb2.Member()
        finally:
            db.close()

    # --- Delete Member ---
    def DeleteMember(self, request, context):
        try:
            validators.validate_positive_int('id', request.id)
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
            return empty_pb2.Empty()

        db = SessionLocal()
        try:
            member = member_service.get_member(db, request.id)
            if not member:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(constants.MSG_MEMBER_NOT_FOUND)
                return empty_pb2.Empty()
            # prevent deletion if active borrowings
            if db.query(Borrowing).filter(Borrowing.member_id == member.id, Borrowing.returned_at == None).first():
                context.set_code(grpc.StatusCode.FAILED_PRECONDITION)
                context.set_details(constants.MSG_CANNOT_DELETE_MEMBER_WITH_BORROWED)
                return empty_pb2.Empty()
            member_service.delete_member(db, member)
            return empty_pb2.Empty()
        except Exception as e:
            logger.exception("DeleteMember failed")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return empty_pb2.Empty()
        finally:
            db.close()
