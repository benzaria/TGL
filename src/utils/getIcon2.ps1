
param (
    [string[]]$exePaths,  # Accepts multiple .exe files
    [switch]$Force
)

# Check if no arguments are provided
if ($exePaths.Count -eq 1) {
    # If no arguments, search for all .exe files within a 3-level depth
    if (Test-Path -PathType Container $exePaths) {
        $exePaths = Get-ChildItem -File -Filter "*.exe" -Depth 2 -Path $exePaths
        if ($exePaths.Count -eq 0) {
            Write-Host "Error: No EXE files found in the directory with the specified depth."
            exit 1
        }
    }
}

foreach ($exePath in $exePaths) {
    if (-not (Test-Path $exePath)) {
        Write-Host "Skipping: File not found - $exePath"
        continue
    }

    try {
        $exeDir = [System.IO.Path]::GetDirectoryName($exePath)
        $exeName = [System.IO.Path]::GetFileNameWithoutExtension($exePath)
        $sixelPath = Join-Path $exeDir "$exeName.six"

        # Check if the .sixel file already exists, if so, skip this one
        if ((Test-Path $sixelPath) -and -not $Force) {
            Write-Host "Skipping: $exeName.six already exists."
            continue
        }

        # Extract icon
        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exePath)
        $icoPath = Join-Path $exeDir "$exeName.ico"
        $pngPath = Join-Path $exeDir "$exeName.png"

        # Save icon as .ico
        $icon.ToBitmap().Save($icoPath, [System.Drawing.Imaging.ImageFormat]::Icon)
        Write-Host "Icon extracted: $icoPath"

        # Convert .ico to .png using FFmpeg
        $ffmpegCommand = "ffmpeg -y -i `"$icoPath`" -vf scale=32:32 `"$pngPath`""
        Invoke-Expression $ffmpegCommand > $null
        Write-Host "Converted to PNG: $pngPath"

        # Convert .png to Sixel
        Import-Module Sixel
        $sixel = ConvertTo-Sixel $pngPath -Protocol Sixel > $sixelPath
        Write-Host "Converted to Sixel: $sixelPath"

        # Clean up temporary files
        Remove-Item $pngPath
        Remove-Item $icoPath

    } catch {
        Write-Host "Error processing $exePath - $_"
    }
}

