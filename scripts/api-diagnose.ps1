$ErrorActionPreference = 'Continue'
function PostJson($url, $payload) {
  try {
    $r = Invoke-RestMethod -Uri $url -Method Post -ContentType 'application/json' -Body $payload -TimeoutSec 60
    return $r
  } catch {
    $msg = $_.Exception.Message
    $status = $null
    if ($_.Exception.Response) { $status = $_.Exception.Response.StatusCode }
    return @{ error = $msg; status = $status }
  }
}

Write-Output '=== CHAT MESSAGE (AI) ==='
$m = PostJson 'http://localhost:3000/api/chat/message' '{"conversationId":"6aabde33e3f29574fd3c86f5","message":"What services do you offer?"}'
Write-Output ($m | ConvertTo-Json -Compress -Depth 6)

Write-Output '=== HOME PAGE (120s timeout) ==='
try {
  $page = Invoke-WebRequest -Uri 'http://localhost:3000/' -TimeoutSec 120 -UseBasicParsing
  Write-Output ('HOME_STATUS: ' + $page.StatusCode)
  Write-Output ('HOME_LENGTH: ' + $page.Content.Length)
} catch {
  Write-Output ('HOME_ERROR: ' + $_.Exception.Message)
}