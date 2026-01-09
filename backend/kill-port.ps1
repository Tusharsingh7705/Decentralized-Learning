# Kill process running on port 5000
$port = 5000
Write-Host "Checking for process on port $port..." -ForegroundColor Yellow

$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process with PID: $process" -ForegroundColor Cyan
    Write-Host "Killing process..." -ForegroundColor Red
    Stop-Process -Id $process -Force
    Write-Host "✓ Process killed successfully!" -ForegroundColor Green
} else {
    Write-Host "✓ No process found on port $port" -ForegroundColor Green
}
