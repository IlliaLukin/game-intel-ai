import sys
from pathlib import Path
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "ai_mode" in data
    assert data["version"] == "1.0.0"


def test_search_games_endpoint():
    response = client.get("/api/games/search?query=Witcher")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Witcher"
    assert isinstance(data["results"], list)


def test_search_games_validation_error():
    # Empty query should trigger 422 Unprocessable Entity
    response = client.get("/api/games/search?query=")
    assert response.status_code == 422


def test_analyze_game_endpoint():
    payload = {
        "title": "Cyberpunk 2077",
        "current_price": 29.99,
        "regular_price": 59.99,
        "discount_percent": 50.0
    }
    response = client.post("/api/games/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["game_title"] == "Cyberpunk 2077"
    assert data["verdict"] in ["Must Buy", "Great Deal", "Wait for Sale", "Skip"]
    assert 0 <= data["score"] <= 10
    assert len(data["pros"]) > 0
    assert "is_mock" in data
