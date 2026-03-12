$dir1 = "c:\Users\natan\OneDrive\RollHub"
$dir2 = "C:\Users\natan\Desktop\Escudo do Mestre\Escudo do Mestre\escudo-do-mestre-v2"

$folders = @("app\controllers", "app\models", "inertia\pages", "inertia\components", "database\migrations", "database\seeders")

$results = @()
$results += "Arquivos no Escudo do Mestre V2 que NAO ESTAO no RollHub:"
$results += "========================================================="

foreach ($folder in $folders) {
    $exists1 = Test-Path "$dir1\$folder"
    $exists2 = Test-Path "$dir2\$folder"
    
    if ($exists2) {
        $files2 = Get-ChildItem -Path "$dir2\$folder" -Recurse -File | Select-Object -ExpandProperty FullName | ForEach-Object { $_.Substring((Convert-Path "$dir2\$folder").Length + 1) }
        
        if ($exists1) {
            $files1 = Get-ChildItem -Path "$dir1\$folder" -Recurse -File | Select-Object -ExpandProperty FullName | ForEach-Object { $_.Substring((Convert-Path "$dir1\$folder").Length + 1) }
            $diff = Compare-Object -ReferenceObject $files1 -DifferenceObject $files2 | Where-Object {$_.SideIndicator -eq "=>"} | Select-Object -ExpandProperty InputObject
        } else {
            $diff = $files2
        }

        if ($diff) {
            $results += "`n[ Pasta: $folder ]"
            foreach ($file in $diff) {
                $results += "  + $file"
            }
        }
    }
}

$results | Out-File "$dir1\diff_arquivos.txt" -Encoding utf8
