# optimize-images.ps1 — ضغط صور public/images (JPEG)
# الاستخدام: powershell -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$dir   = Join-Path $PSScriptRoot '..\public\images'
$max   = 1600       # أطول ضلع بعد الضغط
$quality = [long]80 # جودة JPEG

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
if (-not $codec) { throw 'JPEG encoder not found' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

Get-ChildItem -Path $dir -Filter *.jpg | ForEach-Object {
    $file = $_
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        $ratio = [Math]::Min(1.0, $max / [Math]::Max($img.Width, $img.Height))
        $w = [int][Math]::Round($img.Width * $ratio)
        $h = [int][Math]::Round($img.Height * $ratio)
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.DrawImage($img, 0, 0, $w, $h)
            $tmp = Join-Path $env:TEMP ($file.BaseName + '-optimized.jpg')
            $bmp.Save($tmp, $codec, $params)
            Move-Item -Force -Path $tmp -Destination $file.FullName
            $after = [math]::Round((Get-Item $file.FullName).Length / 1KB, 1)
            Write-Host ("{0}: {1} KB -> {2} KB" -f $file.Name, [math]::Round($file.Length/1KB,1), $after)
        } finally { $g.Dispose(); $bmp.Dispose() }
    } finally { $img.Dispose() }
}
