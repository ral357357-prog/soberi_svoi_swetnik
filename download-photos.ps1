# Download real photos via Wikimedia Special:FilePath
$ua = "FlowerGardenBuilder/1.0 (garden-tool@local)"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$plantsDir = Join-Path $root "assets\plants"
$gardensDir = Join-Path $root "assets\gardens"
New-Item -ItemType Directory -Force -Path $plantsDir, $gardensDir | Out-Null

$plants = @{
  lavender   = "Single_lavendar_flower02.jpg"
  hosta      = "Hosta_tardiflora_kz02.jpg"
  daylily    = "Hemerocallis_fulva.jpg"
  astilbe    = "Astilbe_arenostachya.jpg"
  sedum      = "Sedum_acre_002.jpg"
  phlox      = "Phlox_paniculata_001.jpg"
  iris       = "Iris_germanica_%27Flag%27.jpg"
  fern       = "Dryopteris_filix-mas.jpg"
  coneflower = "Echinacea_purpurea_%27Maxima%27.jpg"
  geranium   = "Geranium_sanguineum_20060624.jpg"
  yarrow     = "Achillea_millefolium_%28flowers%29.jpg"
  brunnera   = "Brunnera_macrophylla_2006-04-11.jpg"
  spirea     = "Spiraea_japonica_001.jpg"
  hydrangea  = "Hydrangea_paniculata_%27Grandiflora%27.jpg"
  barberry   = "Berberis_thunbergii_Chouja01.jpg"
  lilac      = "Syringa_vulgaris_flowers.jpg"
  jasmine    = "Philadelphus_coronarius0.jpg"
  dogwood    = "Cornus_alba_%27Sibirica%27.jpg"
  thuja      = "Thuja_occidentalis.jpg"
  spruce     = "Picea_abies_%28Norway_Spruce%29.jpg"
  apple      = "Malus_domestica_a1.jpg"
  willow     = "Salix_caprea_2.jpg"
  rose       = "Rosa_Primula_20070601.jpg"
  clematis   = "Clematis_viticella_R%C3%A9flexion.jpg"
  salvia     = "Salvia_nemorosa_001.jpg"
  heuchera   = "Heuchera_sanguinea_1.jpg"
}

$gardens = @{
  open   = "Cottage_garden_border_at_Barnsdale.jpg"
  border = "Garden_path%2C_Ashridge_Estate%2C_Berkhamsted%2C_Hertfordshire%2C_UK.jpg"
  house  = "Cottage_garden_at_Boreham%2C_Essex%2C_England_1.jpg"
  pond   = "Water_garden_at_Bodnant_Garden%2C_Wales.jpg"
  meadow = "Wildflower_meadow%2C_Colby_Woodland_Garden_-_geograph.org.uk_-_7193230.jpg"
  grass  = "Grass_closeup.jpg"
}

function Download-Wiki($fileName, $outPath, $width) {
  $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$fileName`?width=$width"
  curl.exe -sL -A $ua --connect-timeout 30 --max-time 120 -o $outPath $url
  if (-not (Test-Path $outPath)) { return $false }
  $size = (Get-Item $outPath).Length
  if ($size -lt 8000) { Remove-Item $outPath -Force; return $false }
  $bytes = Get-Content $outPath -Encoding Byte -TotalCount 3
  if (-not ($bytes[0] -eq 255 -and $bytes[1] -eq 216)) { Remove-Item $outPath -Force; return $false }
  return $true
}

$ok = 0; $fail = 0

foreach ($key in $plants.Keys) {
  $out = Join-Path $plantsDir "$key.jpg"
  if (Download-Wiki $plants[$key] $out 500) { $ok++; Write-Host "OK plant: $key" }
  else { $fail++; Write-Host "FAIL plant: $key" }
  Start-Sleep -Milliseconds 1200
}

foreach ($key in $gardens.Keys) {
  $out = Join-Path $gardensDir "$key.jpg"
  if (Download-Wiki $gardens[$key] $out 900) { $ok++; Write-Host "OK garden: $key" }
  else { $fail++; Write-Host "FAIL garden: $key" }
  Start-Sleep -Milliseconds 1200
}

foreach ($pair in @{ fence='open'; slope='meadow'; path='border' }.GetEnumerator()) {
  $src = Join-Path $gardensDir "$($pair.Value).jpg"
  $dst = Join-Path $gardensDir "$($pair.Key).jpg"
  if (Test-Path $src) { Copy-Item $src $dst -Force; Write-Host "OK garden: $($pair.Key) (copy)" }
}

Write-Host "Done. OK=$ok FAIL=$fail"
