$r = Select-String -Path "src\constants\mock.ts","src\constants\mockPart2.ts" -Pattern "spotify:|instagram:|twitter:|youtube:|apple:|facebook:|soundCloud:|tiktok:|website:"
$r | ForEach-Object { "$($_.Filename):$($_.LineNumber):$($_.Line.Trim())" } | Out-File "social_audit_raw.txt" -Encoding utf8
Write-Host "Total social link lines found: $($r.Count)"
