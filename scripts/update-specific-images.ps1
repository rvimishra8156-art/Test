$ErrorActionPreference = "Continue"

$productsFile = "$PSScriptRoot\..\data\products.json"
$targetDir = "$PSScriptRoot\..\public\images\stock"
$updates = @{
    "prod-002" = @{ file="stock-pen-holder.jpg"; url="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80" }
    "prod-004" = @{ file="stock-book-stand.jpg"; url="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80" }
    "prod-014" = @{ file="stock-remote-holder.jpg"; url="https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=800&q=80" }
    "prod-018" = @{ file="stock-executive-pen.jpg"; url="https://images.unsplash.com/photo-1549114674-d07d1887e2b7?auto=format&fit=crop&w=800&q=80" }
    "prod-032" = @{ file="stock-laptop-stand.jpg"; url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" }
}

# Ensure directory exists
if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir }

# Download Images
foreach ($productId in $updates.Keys) {
    $info = $updates[$productId]
    $dest = Join-Path $targetDir $info.file
    Write-Host "Downloading for $productId -> $($info.url)..."
    try {
        Invoke-WebRequest -Uri $info.url -OutFile $dest
        Write-Host "  Success: $dest"
    } catch {
        Write-Error "Failed to download $($info.url): $_"
    }
}

# Update JSON
$json = Get-Content $productsFile -Raw | ConvertFrom-Json

$modified = $false
foreach ($p in $json) {
    # Fix prod-002 specific bad image
    if ($p.id -eq "prod-002") {
        $badImg = "/images/prod-002-gen-7118.jpg"
        if ($p.images -contains $badImg) {
            $p.images = $p.images | Where-Object { $_ -ne $badImg }
            Write-Host "Removed bad image from prod-002"
            $modified = $true
        }
    }

    # Apply updates
    if ($updates.ContainsKey($p.id)) {
        $newImg = "/images/stock/" + $updates[$p.id].file
        
        # Remove generic 'product-004.png'
        $p.images = $p.images | Where-Object { $_ -ne "/images/product-004.png" }
        
        # Add new image at start
        $p.images = @($newImg) + $p.images
        
        # Unique
        $p.images = $p.images | Select-Object -Unique
        
        Write-Host "Updated images for $($p.id)"
        $modified = $true
    }
}

if ($modified) {
    $json | ConvertTo-Json -Depth 10 | Set-Content $productsFile
    Write-Host "Updated products.json successfully."
}
