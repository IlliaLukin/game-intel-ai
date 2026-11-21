$nodeDir = "C:\Users\Alexb\AppData\Local\Programs\nodejs"
if ($env:Path -notlike "*$nodeDir*") {
    $env:Path = "$nodeDir;$env:Path"
}
Set-Location "$PSScriptRoot\frontend"
Write-Host "Starting GameIntel AI Frontend on http://localhost:3000..." -ForegroundColor Magenta
npm run dev -- --port 3000
