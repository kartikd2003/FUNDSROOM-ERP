 = 'e:\KARTIK\PROJECTS\Fundsroom\backend\prisma\schema.prisma'
 = @()
 += 'generator client {'
 += '  provider =  prisma-client-js'
 += '}'
 += ''
 += 'datasource db {'
 += '  provider = mysql'
 += '  url      = env(DATABASE_URL)'
 += '}'
 -join [Environment]::NewLine | Set-Content -Path 
Write-Host 'test ok'
