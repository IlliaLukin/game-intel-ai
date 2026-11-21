Write-Host "Launching GameIntel AI (Backend + Frontend)..." -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-backend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-frontend.ps1"

Start-Sleep -Seconds 3
Write-Host "Opening browser at http://localhost:3000..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"
