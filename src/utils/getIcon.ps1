
param (
    [string[]]$exePaths  # Accepts multiple .exe files
)

if ($exePaths.Count -eq 0) {
    Write-Host "Error: No EXE files provided."
    exit 1
}

foreach ($exePath in $exePaths) {
    if (-not (Test-Path $exePath)) {
        Write-Host "Skipping: File not found - $exePath"
        continue
    }

    try {
        # Extract icon
        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exePath)
        $exeDir = [System.IO.Path]::GetDirectoryName($exePath)
        $exeName = [System.IO.Path]::GetFileNameWithoutExtension($exePath)
        $icoPath = Join-Path $exeDir "$exeName.ico"
        $pngPath = Join-Path $exeDir "$exeName.png"
        $sixelPath = Join-Path $exeDir "$exeName.six"

        # Save icon as .ico
        $icon.ToBitmap().Save($icoPath, [System.Drawing.Imaging.ImageFormat]::Icon)
        Write-Host "Icon extracted: $icoPath"

        # Convert .ico to .png using FFmpeg
        $ffmpegCommand = "ffmpeg -y -i `"$icoPath`" -vf scale=128:128 `"$pngPath`""
        Invoke-Expression $ffmpegCommand > $null
        Write-Host "Converted to PNG: $pngPath"

        # Convert .png to Sixel
        Import-Module Sixel
        $sixel = ConvertTo-Sixel $pngPath -Protocol Sixel > $sixelPath
        Write-Host "Converted to Sixel: $sixelPath"

        del $pngPath
        del $icoPath

    } catch {
        Write-Host "Error processing $exePath - $_"
    }
}

