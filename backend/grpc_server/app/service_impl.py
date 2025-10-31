import generated.library_pb2 as library_pb2
import generated.library_pb2_grpc as library_pb2_grpc
from app.database import SessionLocal
from app.models import Book, Member, Borrowing
import grpc
from datetime import datetime
from google.protobuf import empty_pb2

class LibraryServiceImpl(library_pb2_grpc.LibraryServiceServicer):
    def CreateBook(self, request, context):
        db = SessionLocal()
        book = Book(title=request.title, author=request.author)
        db.add(book)
        db.commit()
        db.refresh(book)
        return library_pb2.Book(id=book.id, title=book.title, author=book.author, available=book.available)

    def ListBooks(self, request, context):
        db = SessionLocal()
        books = db.query(Book).all()
        books = sorted(books, key=lambda b: b.id)
        return library_pb2.BookList(books=[
            library_pb2.Book(id=b.id, title=b.title, author=b.author, available=b.available)
            for b in books
        ])
    
    def ListAvailableBooks(self, request, context):
        db = SessionLocal()
        books = db.query(Book).filter(Book.available == True).all()
        books = sorted(books, key=lambda b: b.id)
        return library_pb2.BookList(books=[
            library_pb2.Book(id=b.id, title=b.title, author=b.author, available=b.available)
            for b in books
        ])

    def BorrowBook(self, request, context):
        db = SessionLocal()
        #print(request.book_id, request.member_id)
        book = db.query(Book).filter(Book.id == request.book_id, Book.available == True).first()
        if not book:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details('Book not available')
            return library_pb2.Empty()
        book.available = False
        borrowing = Borrowing(book_id=request.book_id, member_id=request.member_id)
        db.add(borrowing)
        db.commit()
        return library_pb2.Empty()

    
    #  Add Member
    def AddMember(self, request, context):
        db = SessionLocal()
        member = Member(name=request.name, contact=request.contact)
        db.add(member)
        db.commit()
        db.refresh(member)
        return library_pb2.Member(
            id=member.id,
            name=member.name,
            contact=member.contact
        )

    # List Members
    def ListMembers(self, request, context):
        db = SessionLocal()
        members = db.query(Member).all()
        members = sorted(members, key=lambda m: m.id)
        return library_pb2.MemberList(members=[
            library_pb2.Member(
                id=m.id,
                name=m.name,
                contact=m.contact
            ) for m in members
        ])
    
    def ListBorrowedBooks(self, request, context):
        db = SessionLocal()
        borrowings = (
            db.query(Borrowing)
            .join(Book, Borrowing.book_id == Book.id)
            .join(Member, Borrowing.member_id == Member.id)
            .filter(Borrowing.returned_at == None)
            .all()
        )

        borrowed_books = [
            library_pb2.BorrowedBook(
                borrowing_id=b.id,
                book_id=b.book.id,
                book_title=b.book.title,
                member_id=b.member.id,
                member_name=b.member.name,
                borrowing_date=b.borrowed_at.strftime("%Y-%m-%d %H:%M:%S")[:10],
            )
            for b in borrowings
        ]
        return library_pb2.BorrowedBooksResponse(borrowed_books=borrowed_books)

    def ReturnBook(self, request, context):
        db = SessionLocal()
        borrowing = db.query(Borrowing).filter(Borrowing.id == request.borrowing_id).first()
        if not borrowing:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Borrowing record not found")
            return empty_pb2.Empty()
        borrowing.returned_at = datetime.utcnow()
        borrowing.book.available = True
        db.commit()
        return empty_pb2.Empty()
    
    # Update Book
    def UpdateBook(self, request, context):
        db = SessionLocal()
        book = db.query(Book).filter(Book.id == request.id).first()
        if not book:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Book not found")
            return empty_pb2.Empty()
        book.title = request.title
        book.author = request.author
        db.commit()
        db.refresh(book)
        return library_pb2.Book(
            id=book.id, title=book.title, author=book.author, available=book.available
        )

    # Delete Book
    def DeleteBook(self, request, context):
        db = SessionLocal()
        book = db.query(Book).filter(Book.id == request.id).first()
        if not book:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Book not found")
            return empty_pb2.Empty()

        if not book.available:
            context.set_code(grpc.StatusCode.FAILED_PRECONDITION)
            context.set_details("Cannot delete a borrowed book")
            return empty_pb2.Empty()

        db.delete(book)
        db.commit()
        return empty_pb2.Empty()
    
    # --- Update Member ---
    def UpdateMember(self, request, context):
        db = SessionLocal()
        member = db.query(Member).filter(Member.id == request.id).first()
        if not member:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Member not found")
            return empty_pb2.Empty()

        member.name = request.name
        member.contact = request.contact
        db.commit()
        db.refresh(member)

        return library_pb2.Member(id=member.id, name=member.name, contact=member.contact)

    # --- Delete Member ---
    def DeleteMember(self, request, context):
        db = SessionLocal()
        member = db.query(Member).filter(Member.id == request.id).first()
        if not member:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Member not found")
            return empty_pb2.Empty()

        # if you have borrowed books tied to the member, prevent deletion
        if db.query(Borrowing).filter(Borrowing.member_id == member.id, Borrowing.returned_at == None).first():
            context.set_code(grpc.StatusCode.FAILED_PRECONDITION)
            context.set_details("Cannot delete member with borrowed books")
            return empty_pb2.Empty()

        db.delete(member)
        db.commit()
        return empty_pb2.Empty()
