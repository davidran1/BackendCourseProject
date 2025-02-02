import requests
import pytest

BASE_URL = "http://localhost:3000/api"

# Test POST /add - Adding a cost item
def test_add_cost():
    item = {
        "description": "Choco",
        "category": "food",
        "userid": 123123,
        "sum": 12
    }
    response = requests.post(f"{BASE_URL}/add", json=item)
    
    assert response.status_code == 200
    data = response.json()
    assert "description" in data
    assert "category" in data
    assert "userid" in data
    assert "sum" in data
    assert data["description"] == "Choco"
    assert data["category"] == "food"
    assert data["sum"] == 12

    # Test GET /report - Getting monthly report
def test_get_report():
    params = {
        "id": 123123,
        "year": 2025,
        "month": 2
    }
    response = requests.get(f"{BASE_URL}/report", params=params)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "userid" in data
    assert "year" in data
    assert "month" in data
    assert "costs" in data

    # Test GET /users/{id} - Getting user details
def test_get_user_details():
    user_id = 123123
    response = requests.get(f"{BASE_URL}/users/{user_id}")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "first_name" in data
    assert "last_name" in data
    assert "id" in data
    assert "total" in data
    assert data["id"] == user_id

    # Test GET /about - Getting developers team details
def test_get_developers_team():
    response = requests.get(f"{BASE_URL}/about")
    
    assert response.status_code == 200
    data = response.json()
    for member in data:
        assert "first_name" in member
        assert "last_name" in member