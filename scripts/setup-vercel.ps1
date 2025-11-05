# Colors
$GREEN = "Green"
$BLUE = "Cyan"
$RED = "Red"
$YELLOW = "Yellow"

Write-Host "========================================" -ForegroundColor $BLUE
Write-Host "   Vercel Deployment Setup Script" -ForegroundColor $BLUE
Write-Host "========================================`n" -ForegroundColor $BLUE

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI chua duoc cai dat!" -ForegroundColor $RED
    Write-Host "Dang cai dat Vercel CLI...`n" -ForegroundColor $GREEN
    npm install -g vercel
}

Write-Host "✓ Vercel CLI da san sang`n" -ForegroundColor $GREEN

# Login to Vercel
Write-Host "Buoc 1: Dang nhap Vercel" -ForegroundColor $BLUE
vercel login

# Link project
Write-Host "`nBuoc 2: Link project voi Vercel" -ForegroundColor $BLUE
vercel link

# Get project info
$projectJsonPath = ".vercel\project.json"
if (Test-Path $projectJsonPath) {
    Write-Host "`n✓ Project da duoc link thanh cong!" -ForegroundColor $GREEN
    Write-Host "Thong tin project:" -ForegroundColor $BLUE
    Get-Content $projectJsonPath
    
    # Parse JSON
    $projectInfo = Get-Content $projectJsonPath | ConvertFrom-Json
    $ORG_ID = $projectInfo.orgId
    $PROJECT_ID = $projectInfo.projectId
    
    Write-Host "`n========================================" -ForegroundColor $BLUE
    Write-Host "Them cac secrets sau vao GitHub:" -ForegroundColor $GREEN
    Write-Host "========================================" -ForegroundColor $BLUE
    Write-Host "VERCEL_ORG_ID: " -ForegroundColor $GREEN -NoNewline
    Write-Host $ORG_ID -ForegroundColor $YELLOW
    Write-Host "VERCEL_PROJECT_ID: " -ForegroundColor $GREEN -NoNewline
    Write-Host $PROJECT_ID -ForegroundColor $YELLOW
    Write-Host "VERCEL_TOKEN: " -ForegroundColor $RED -NoNewline
    Write-Host "Tao tai https://vercel.com/account/tokens" -ForegroundColor $YELLOW
    Write-Host "========================================`n" -ForegroundColor $BLUE
} else {
    Write-Host "✗ Khong tim thay file .vercel\project.json" -ForegroundColor $RED
    Write-Host "Vui long chay lai script!" -ForegroundColor $RED
}

Write-Host "`n✓ Setup hoan tat!" -ForegroundColor $GREEN
Write-Host "Buoc tiep theo:" -ForegroundColor $BLUE
Write-Host "1. Tao token tai: " -NoNewline
Write-Host "https://vercel.com/account/tokens" -ForegroundColor $GREEN
Write-Host "2. Them secrets vao GitHub: " -NoNewline
Write-Host "https://github.com/YOUR_REPO/settings/secrets/actions" -ForegroundColor $GREEN
Write-Host "3. Push code len GitHub de kich hoat CI/CD`n"
