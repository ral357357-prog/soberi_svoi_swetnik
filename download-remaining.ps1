$ua = "FlowerGardenBuilder/1.0"
$root = "C:\Users\Matebook14\Desktop\CURSOR\flower-garden-builder\assets"
$remaining = @{
  "$root\plants\iris.jpg"       = @("Iris_kochii_01.jpg","Iris_pseudacorus.jpg","Iris_flower.jpg")
  "$root\plants\clematis.jpg"   = @("Clematis_'Jackmanii'.jpg","Clematis_florida.jpg","Clematis_vine.jpg")
  "$root\plants\spirea.jpg"     = @("Spiraea_japonica_'Goldflame'.jpg","Spiraea_arguta.jpg","Spiraea_prunifolia.jpg")
  "$root\plants\rose.jpg"       = @("Rosa_'Blush_Noisette'.jpg","Rosa_chinensis.jpg","Pink_Rose.jpg")
  "$root\plants\brunnera.jpg"   = @("Brunnera_macrophylla_'Langtrees'.jpg","Brunnera_macrophylla_flower.jpg")
  "$root\plants\phlox.jpg"      = @("Phlox_drummondii.jpg","Phlox_paniculata_'White_Delta'.jpg","Phlox_subulata.jpg")
  "$root\plants\coneflower.jpg" = @("Purple_coneflower.jpg","Echinacea_purpurea_flower.jpg","Echinacea_angustifolia.jpg")
  "$root\plants\barberry.jpg"   = @("Berberis_vulgaris_fruit.jpg","Berberis_thunbergii_'Atropurpurea_Nana'.jpg","Berberis.jpg")
  "$root\gardens\open.jpg"      = @("Flowerbed_in_the_Botanischer_Garten_Berlin.jpg","Mixed_perennial_border.jpg","Flower_border_at_Wisley.jpg")
  "$root\gardens\meadow.jpg"    = @("Flower_meadow_(3993272857).jpg","Meadow_with_wildflowers.jpg","Wild_flower_meadow.jpg")
  "$root\gardens\pond.jpg"      = @("Pond_in_an_English_garden.jpg","Garden_pond_with_lilies.jpg","Water_lily_pond.jpg")
  "$root\gardens\house.jpg"     = @("House_with_a_garden.jpg","Front_garden_of_a_house.jpg","Residential_garden.jpg")
}

function Try-Dl($names, $out, $w) {
  foreach ($n in $names) {
    $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$n`?width=$w"
    curl.exe -sL -A $ua -o $out $url
    if (Test-Path $out) {
      $b = Get-Content $out -Encoding Byte -TotalCount 3 -EA SilentlyContinue
      if ((Get-Item $out).Length -gt 8000 -and $b[0]-eq 255 -and $b[1]-eq 216) { return $true }
      Remove-Item $out -Force -EA SilentlyContinue
    }
    Start-Sleep -Milliseconds 900
  }
  return $false
}

$ok=0;$fail=0
foreach ($entry in $remaining.GetEnumerator()) {
  if ((Test-Path $entry.Key) -and (Get-Item $entry.Key).Length -gt 8000) { Write-Host "SKIP $($entry.Key)"; continue }
  $w = if ($entry.Key -like '*\gardens\*') { 900 } else { 500 }
  if (Try-Dl $entry.Value $entry.Key $w) { $ok++; Write-Host "OK $($entry.Key)" }
  else { $fail++; Write-Host "FAIL $($entry.Key)" }
}
foreach ($p in @{fence='open';slope='meadow';path='border'}.GetEnumerator()) {
  $s = "$root\gardens\$($p.Value).jpg"; $d = "$root\gardens\$($p.Key).jpg"
  if (Test-Path $s) { Copy-Item $s $d -Force; Write-Host "COPY $($p.Key)" }
}
Write-Host "Remaining OK=$ok FAIL=$fail"
