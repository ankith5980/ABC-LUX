$file = 'src\responsive.css'
$c = Get-Content $file -Raw

# Feedback
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. FEEDBACK / TESTIMONIALS.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   8. FEEDBACK`r`n   ------------------------------------------------------------ */"

# Products horizontal scroll (Testimonials.tsx comment)
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. PRODUCTS SECTION.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   5. PRODUCTS (LIGHTDARK)`r`n   ------------------------------------------------------------ */"

# Contact
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. CONTACT / ADMISSION.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   9. CONTACT`r`n   ------------------------------------------------------------ */"

# Footer
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. FOOTER.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   10. FOOTER`r`n   ------------------------------------------------------------ */"

# Menu Overlay
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. MENU OVERLAY.*?[\r\n]+\s*-{10,}\s*\*/', "/* --- MenuOverlay --- */"

# Lighting Experience (Products/LightDark)
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. LIGHTING EXPERIENCE.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   5. PRODUCTS (LIGHTDARK)`r`n   ------------------------------------------------------------ */"

# Star Divider
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. STAR DIVIDER.*?[\r\n]+\s*-{10,}\s*\*/', "/* --- Star Divider --- */"

# Global Typography
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. GLOBAL TYPOGRAPHY.*?[\r\n]+\s*-{10,}\s*\*/', "/* --- Global Typography Safety Net --- */"

# Disable complex animations
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. DISABLE COMPLEX.*?[\r\n]+\s*-{10,}\s*\*/', "/* ------------------------------------------------------------`r`n   12. UTILITY / ANIMATIONS`r`n   ------------------------------------------------------------ */"

# Safe touch cursor
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. SAFE TOUCH.*?[\r\n]+\s*-{10,}\s*\*/', "/* --- Touch-device cursor reset --- */"

# Moved from components
$c = $c -replace '(?s)/\*\s*-{10,}\s*[\r\n]+\s*. MOVED FROM COMPONENTS.*?[\r\n]+\s*-{10,}\s*\*/', "/* --- Moved from components / JS media query index --- */"

Set-Content $file $c -NoNewline
Write-Host "Done."
