from typing import Optional

def validate_required_str(field_name: str, value: Optional[str]):
    if value is None or not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} is required and must be a non-empty string")

def validate_positive_int(field_name: str, value: Optional[int]):
    if value is None or not isinstance(value, int) or value <= 0:
        raise ValueError(f"{field_name} must be a positive integer")
