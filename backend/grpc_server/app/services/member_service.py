from sqlalchemy.orm import Session
from app.models import Member
from app.logging_config import logger

def create_member(db: Session, name: str, contact: str) -> Member:
    member = Member(name=name.strip(), contact=contact.strip())
    db.add(member)
    try:
        db.commit()
        db.refresh(member)
        logger.info("Created member", extra={"member_id": member.id, "member_name": member.name})
        return member
    except Exception:
        db.rollback()
        logger.exception("Failed to create member")
        raise

def list_members(db: Session):
    return db.query(Member).order_by(Member.id).all()

def get_member(db: Session, member_id: int):
    return db.query(Member).filter(Member.id == member_id).first()

def update_member(db: Session, member: Member, name: str, contact: str):
    member.name = name
    member.contact = contact
    try:
        db.commit()
        db.refresh(member)
        return member
    except Exception:
        db.rollback()
        raise

def delete_member(db: Session, member: Member):
    db.delete(member)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise
