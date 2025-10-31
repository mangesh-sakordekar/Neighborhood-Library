import pytest
from app import validators

def test_validate_required_str():
    # Valid cases
    validators.validate_required_str("test", "value")
    validators.validate_required_str("test", "   spaced   ")
    
    # Invalid cases
    with pytest.raises(ValueError):
        validators.validate_required_str("test", None)
    with pytest.raises(ValueError):
        validators.validate_required_str("test", "")
    with pytest.raises(ValueError):
        validators.validate_required_str("test", "   ")
    with pytest.raises(ValueError):
        validators.validate_required_str("test", 123)  # wrong type

def test_validate_positive_int():
    # Valid cases
    validators.validate_positive_int("test", 1)
    validators.validate_positive_int("test", 100)
    
    # Invalid cases
    with pytest.raises(ValueError):
        validators.validate_positive_int("test", None)
    with pytest.raises(ValueError):
        validators.validate_positive_int("test", 0)
    with pytest.raises(ValueError):
        validators.validate_positive_int("test", -1)
    with pytest.raises(ValueError):
        validators.validate_positive_int("test", "123")  # wrong type