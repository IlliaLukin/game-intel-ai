Set-Location "$PSScriptRoot\backend"
Write-Host "Starting GameIntel AI Backend on http://localhost:8000..." -ForegroundColor Cyan
.\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
