$ErrorActionPreference = 'Continue'
$key = (Get-Content '..\.env.local' -ErrorAction SilentlyContinue | Select-String -Pattern '^GROQ_API_KEY=').ToString().Replace('GROQ_API_KEY=', '')
if ($key -eq '') {
  Write-Output 'NO GROQ KEY IN .env.local'
} else {
  try {
    $headers = @{ Authorization = "Bearer $key" }
    $r = Invoke-RestMethod -Uri 'https://api.groq.com/openai/v1/models' -Method Get -Headers $headers -TimeoutSec 30
    Write-Output ('TOTAL_MODELS: ' + $r.data.Count)
    $ids = $r.data | ForEach-Object { $_.id } | Sort-Object
    Write-Output ($ids | Out-String)
  } catch {
    Write-Output ('GROQ_LIST_ERROR: ' + $_.Exception.Message)
    if ($_.Exception.Response) { Write-Output ('STATUS: ' + $_.Exception.Response.StatusCode) }
  }
}