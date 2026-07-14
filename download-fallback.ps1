# Download remaining photos with fallback filenames
$ua = "FlowerGardenBuilder/1.0 (garden-tool@local)"
$root = "C:\Users\Matebook14\Desktop\CURSOR\flower-garden-builder\assets"
$plantsDir = "$root\plants"
$gardensDir = "$root\gardens"

$fallbacks = @{
  spruce     = @("Picea_abies.jpg", "Picea_abies_cone.jpg", "Spruce_forest.jpg")
  iris       = @("Iris_germanica_1.jpg", "Iris_germanica_flower.jpg", "Iris_(flower).jpg")
  geranium   = @("Geranium_sanguineum.jpg", "Geranium_macrorrhizum.jpg")
  jasmine    = @("Philadelphus_coronarius.jpg", "Philadelphus_coronarius2.jpg")
  sedum      = @("Sedum_acre.jpg", "Sedum_spurium.jpg")
  spirea     = @("Spiraea_japonica.jpg", "Spiraea_japonica_'Goldflame'.jpg")
  clematis   = @("Clematis_viticella.jpg", "Clematis_'Nelly_Moser'.jpg")
  yarrow     = @("Achillea_millefolium.jpg", "Achillea_filipendulina.jpg")
  salvia     = @("Salvia_nemorosa.jpg", "Salvia_officinalis.jpg")
  astilbe    = @("Astilbe_japonica.jpg", "Astilbe_rivularis.jpg")
  rose       = @("Rosa_Primula.jpg", "Rosa_rubiginosa.jpg", "Pink_rose_flower.jpg")
  hydrangea  = @("Hydrangea_paniculata.jpg", "Hydrangea_macrophylla.jpg")
  brunnera   = @("Brunnera_macrophylla.jpg", "Brunnera_macrophylla_'Jack_Frost'.jpg")
  dogwood    = @("Cornus_alba.jpg", "Cornus_alba_'Sibirica_Variegata'.jpg")
  phlox      = @("Phlox_paniculata.jpg", "Phlox_subulata.jpg")
  coneflower = @("Echinacea_purpurea.jpg", "Echinacea_purpurea_2.jpg")
  barberry   = @("Berberis_thunbergii.jpg", "Berberis_thunbergii_'Atropurpurea'.jpg")
  willow     = @("Salix_caprea.jpg", "Salix_babylonica.jpg")
  grass      = @("Grass_close_up.jpg", "Grass_01.jpg", "Green_grass.jpg")
  open       = @("Cottage_garden.jpg", "English_cottage_garden.jpg", "Flowerbed_in_the_garden.jpg")
  meadow     = @("Wildflower_meadow.jpg", "Meadow_with_flowers.jpg")
  border     = @("Garden_path.jpg", "Garden_path_in_England.jpg")
  pond       = @("Water_garden.jpg", "Garden_pond.jpg")
  house      = @("Cottage_garden_in_July.jpg", "House_garden.jpg")
}

function Try-Download($names, $out, $width) {
  foreach ($name in $names) {
    $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$name`?width=$width"
    curl.exe -sL -A $ua --connect-timeout 30 --max-time 120 -o $out $url
    if (Test-Path $out) {
      $size = (Get-Item $out).Length
      $bytes = Get-Content $out -Encoding Byte -TotalCount 3 -ErrorAction SilentlyContinue
      if ($size -gt 8000 -and $bytes[0] -eq 255 -and $bytes[1] -eq 216) { return $true }
      Remove-Item $out -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Milliseconds 800
  }
  return $false
}

$ok = 0; $fail = 0
foreach ($key in $fallbacks.Keys) {
  $folder = if ($key -in @('grass','open','meadow','border','pond','house')) { $gardensDir } else { $plantsDir }
  $out = Join-Path $folder "$key.jpg"
  if ((Test-Path $out) -and (Get-Item $out).Length -gt 8000) { Write-Host "SKIP $key (exists)"; continue }
  $w = if ($folder -eq $gardensDir) { 900 } else { 500 }
  if (Try-Download $fallbacks[$key] $out $w) { $ok++; Write-Host "OK $key" }
  else { $fail++; Write-Host "FAIL $key" }
  Start-Sleep -Milliseconds 1000
}

foreach ($pair in @{ fence='open'; slope='meadow'; path='border' }.GetEnumerator()) {
  $src = Join-Path $gardensDir "$($pair.Value).jpg"
  $dst = Join-Path $gardensDir "$($pair.Key).jpg"
  if (Test-Path $src) { Copy-Item $src $dst -Force; Write-Host "COPY $($pair.Key)" }
}

Write-Host "Fallback done. OK=$ok FAIL=$fail"
