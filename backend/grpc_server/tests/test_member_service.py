from datetime import datetime
import pytest
from app.services import member_service

def test_create_member(test_db, sample_member_data):
    member = member_service.create_member(test_db, **sample_member_data)
    assert member.name == sample_member_data["name"]
    assert member.contact == sample_member_data["contact"]
    assert isinstance(member.created_at, datetime)

def test_list_members(test_db, sample_member_data):
    # Create test members
    member1 = member_service.create_member(test_db, **sample_member_data)
    member2 = member_service.create_member(test_db, name="Member 2", contact="member2@test.com")
    
    members = member_service.list_members(test_db)
    assert len(members) == 2
    assert members[0].id == member1.id
    assert members[1].id == member2.id

def test_update_member(test_db, sample_member_data):
    member = member_service.create_member(test_db, **sample_member_data)
    updated = member_service.update_member(test_db, member, "New Name", "new@test.com")
    assert updated.name == "New Name"
    assert updated.contact == "new@test.com"
    assert updated.id == member.id

def test_delete_member(test_db, sample_member_data):
    member = member_service.create_member(test_db, **sample_member_data)
    member_service.delete_member(test_db, member)
    assert member_service.get_member(test_db, member.id) is None