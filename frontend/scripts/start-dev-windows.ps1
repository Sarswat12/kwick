# Start Vite dev server in a new PowerShell window and log output
param(
  [string]$LogFile = "logs\dev.log"
)

$scriptPath = $MyInvocation.MyCommand.Definition
$projectPath = Split-Path -Parent $scriptPath
if (-not (Test-Path (Join-Path $projectPath 'node_modules'))) {
  Write-Host "Run 'npm install' in the project first." -ForegroundColor Yellow
  exit 1
}

# Ensure logs directory exists
$fullLogPath = Join-Path $projectPath $LogFile
New-Item -Path (Split-Path $fullLogPath) -ItemType Directory -Force | Out-Null

# Build the command to run inside the new PowerShell window. Use single-quoted strings where possible and escape inner quotes.
$innerCommand = "cd `"$projectPath`"; npm run dev 2>&1 | Tee-Object -FilePath `"$fullLogPath`""

# Start a new PowerShell process and run the inner command
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $innerCommand -WorkingDirectory $projectPath -WindowStyle Normal

Write-Host "Launched dev server in new window. Logs written to $fullLogPath" -ForegroundColor Green
