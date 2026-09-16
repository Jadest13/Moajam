Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$assetDir = Join-Path $PSScriptRoot '..\packages\app\src\assets'
$publicDir = Join-Path $PSScriptRoot '..\apps\web\public'
New-Item -ItemType Directory -Force -Path $publicDir | Out-Null

function New-LogoBodyPath {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.StartFigure()
  $path.AddBezier(256, 154, 226, 190, 180, 241, 140, 294)
  $path.AddBezier(140, 294, 112, 308, 96, 331, 87, 356)
  $path.AddBezier(87, 356, 110, 397, 176, 425, 256, 425)
  $path.AddBezier(256, 425, 336, 425, 402, 397, 425, 356)
  $path.AddBezier(425, 356, 416, 331, 400, 308, 372, 294)
  $path.AddBezier(372, 294, 332, 241, 286, 190, 256, 154)
  $path.CloseFigure()
  return $path
}

function New-NotePath {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.StartFigure()
  $path.AddLine(304, 169, 304, 83)
  $path.AddBezier(304, 83, 304, 74, 313, 69, 320, 74)
  $path.AddBezier(320, 74, 346, 92, 379, 102, 397, 125)
  $path.AddBezier(397, 125, 407, 138, 411, 154, 408, 169)
  $path.AddBezier(408, 169, 407, 178, 397, 181, 391, 174)
  $path.AddBezier(391, 174, 378, 158, 353, 154, 326, 139)
  $path.AddLine(326, 139, 326, 169)
  $path.CloseFigure()
  return $path
}

function Draw-MoajamMark($graphics, [bool]$onBlue) {
  $body = New-LogoBodyPath
  $opening = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $opening.AddEllipse(174, 223, 164, 164)
  $bodyRegion = [System.Drawing.Region]::new($body)
  $bodyRegion.Exclude($opening)

  if ($onBlue) {
    $leftStart = [System.Drawing.Color]::White
    $leftEnd = [System.Drawing.ColorTranslator]::FromHtml('#F6F8FF')
    $rightStart = [System.Drawing.ColorTranslator]::FromHtml('#DCE5FF')
    $rightEnd = [System.Drawing.ColorTranslator]::FromHtml('#C9D7FF')
  }
  else {
    $leftStart = [System.Drawing.ColorTranslator]::FromHtml('#3B7CF2')
    $leftEnd = [System.Drawing.ColorTranslator]::FromHtml('#2563EB')
    $rightStart = [System.Drawing.ColorTranslator]::FromHtml('#5576D3')
    $rightEnd = [System.Drawing.ColorTranslator]::FromHtml('#3157B8')
  }

  $leftBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.PointF]::new(90, 180),
    [System.Drawing.PointF]::new(250, 420),
    $leftStart,
    $leftEnd
  )
  $rightBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.PointF]::new(422, 180),
    [System.Drawing.PointF]::new(262, 420),
    $rightStart,
    $rightEnd
  )

  $state = $graphics.Save()
  $graphics.SetClip($bodyRegion, [System.Drawing.Drawing2D.CombineMode]::Replace)
  $graphics.FillRectangle($leftBrush, 0, 0, 256, 512)
  $graphics.FillRectangle($rightBrush, 256, 0, 256, 512)
  $graphics.Restore($state)
  $graphics.FillEllipse($leftBrush, 83, 292, 124, 124)
  $graphics.FillEllipse($rightBrush, 305, 292, 124, 124)

  $coralBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.PointF]::new(218, 92),
    [System.Drawing.PointF]::new(302, 226),
    [System.Drawing.ColorTranslator]::FromHtml('#FF8979'),
    [System.Drawing.ColorTranslator]::FromHtml('#FF6F5E')
  )
  $note = New-NotePath
  $graphics.FillPath($coralBrush, $note)
  $graphics.FillEllipse($coralBrush, 191, 104, 130, 130)

  $note.Dispose()
  $coralBrush.Dispose()
  $leftBrush.Dispose()
  $rightBrush.Dispose()
  $bodyRegion.Dispose()
  $opening.Dispose()
  $body.Dispose()
}

function New-LogoPng([string]$path, [int]$width, [int]$height, [bool]$onBlue, [bool]$social = $false) {
  $bitmap = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)

  if ($onBlue) {
    $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      [System.Drawing.PointF]::new(0, 0),
      [System.Drawing.PointF]::new($width, $height),
      [System.Drawing.ColorTranslator]::FromHtml('#3B7CF2'),
      [System.Drawing.ColorTranslator]::FromHtml('#2563EB')
    )
    $graphics.FillRectangle($background, 0, 0, $width, $height)
    $background.Dispose()
  }

  if ($social) {
    $scale = 0.98
    $offsetX = ($width - 512 * $scale) / 2
    $offsetY = ($height - 512 * $scale) / 2
  }
  else {
    $scale = [Math]::Min($width / 512, $height / 512)
    $offsetX = ($width - 512 * $scale) / 2
    $offsetY = ($height - 512 * $scale) / 2
  }

  $graphics.Transform = [System.Drawing.Drawing2D.Matrix]::new($scale, 0, 0, $scale, $offsetX, $offsetY)
  Draw-MoajamMark $graphics $onBlue
  $graphics.ResetTransform()
  $graphics.Dispose()
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

New-LogoPng (Join-Path $assetDir 'moajam-logo-transparent.png') 512 512 $false
New-LogoPng (Join-Path $assetDir 'moajam-logo-blue.png') 512 512 $true
New-LogoPng (Join-Path $publicDir 'apple-touch-icon.png') 180 180 $true
New-LogoPng (Join-Path $publicDir 'moajam-icon-512.png') 512 512 $true
New-LogoPng (Join-Path $publicDir 'moajam-og.png') 1200 630 $true $true

Copy-Item (Join-Path $assetDir 'moajam-logo-blue.svg') (Join-Path $publicDir 'favicon.svg') -Force
