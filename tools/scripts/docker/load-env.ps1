param(
    [string]$envFilePath
)

if (Test-Path $envFilePath) {
    $envVariables = Get-Content $envFilePath | ForEach-Object {
        $line = $_.Trim()
        if ($line -match '^\s*([^#].+?)\s*=\s*(.+)$') {
            $variableName = $matches[1]
            $variableValue = $matches[2]
            [System.Environment]::SetEnvironmentVariable($variableName, $variableValue, [System.EnvironmentVariableTarget]::Process)
        }
    }

    Write-Host "Environment variables loaded from $envFilePath."
} else {
    Write-Host "The specified .env file does not exist: $envFilePath"
}
