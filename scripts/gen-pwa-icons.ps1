# يولّد public/icons/icon-192.png و public/icons/icon-512.png من أيقونة اللمس
# public/icons/apple-touch-icon.png بعد تحديث الشعار.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root 'public/icons/apple-touch-icon.png'
if (-not (Test-Path $sourcePath)) { throw "Missing source: $sourcePath" }
$src = [System.Drawing.Image]::FromFile($sourcePath)
try {
  foreach ($s in 192, 512) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($src, 0, 0, $s, $s)
      } finally { $g.Dispose() }
      $out = Join-Path $root "public/icons/icon-$s.png"
      $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output "Generated: $out"
    } finally { $bmp.Dispose() }
  }
} finally { $src.Dispose() }
