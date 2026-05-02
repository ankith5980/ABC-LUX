$file = 'src\responsive.css'
$c = Get-Content $file -Raw

# ── 1. Remove meaningless/literal comments ───────────────────────────────────
$drop = @(
  '\/\* Container: full-width, compact padding \*\/',
  '\/\* Stack the three cards vertically on mobile \*\/',
  '\/\* All cards: same full-width size on mobile \*\/',
  '\/\* Meta labels row: stack vertically \*\/',
  '\/\* Arrow buttons: always visible on mobile \(no hover\) \*\/',
  '\/\* Mobile showcase card \u2014 slightly larger on phones \*\/',
  '\/\* Caption text: slightly smaller on phones \*\/',
  '\/\* Tablet \(768\u20131023px\): headline sizing \*\/',
  '\/\* Mobile: ensure the mobile-carousel view fills the screen nicely \*\/',
  '\/\* Fix chandelier overflowing\/clipping on narrow screens \*\/',
  '\/\* Hero text: prevent side-text from stacking awkwardly on tablet \*\/',
  '\/\* Peripheral decorative hero SVG path \u2014 hide on very small screens \*\/',
  '\/\* Reduce paddingLeft\/paddingRight on the track \*\/',
  '\/\* Card: slightly smaller on phones so 1\.5 cards are visible \*\/',
  '\/\* Header area in the Products section \*\/',
  '\/\* Product section title \*\/',
  '\/\* Reduce top\/bottom padding \*\/',
  '\/\* Contact info heading: smaller on phone \*\/',
  '\/\* Form: remove horizontal border that cuts off screen edge \*\/',
  '\/\* Submit row: stack on mobile \*\/',
  '\/\* Slightly smaller star on phones \*\/',
  '\/\* Prevent runaway viewport-unit font sizes from overflowing on tiny screens \*\/',
  '\/\* Disable the floating Feedback deco images \(fbk-float keyframe\) \*\/',
  '\/\* Prevent will-change from reserving GPU layers on low-end devices \*\/',
  '\/\* Re-enable default cursor on touch \u2014 lux-cursor class doesn\x27t apply\s+but belt-and-suspenders safety \*\/',
  '\/\* Ensure all buttons\/links look clickable \*\/',
  '\/\* Logo: reduce oversized negative margins that clip on phones \*\/',
  '\/\* Menu button: shrink width so it fits on small screens \*\/',
  '\/\* Keep the scroll animation alive on mobile, but shorten the travel\. \*\/',
  '\/\* Tablet: reduce huge word size slightly \*\/',
  '\/\* Reduce the gap between cards \*\/',
  '\/\* Give the swiper full width \*\/',
  '\/\* Hide nav buttons on mobile as requested for a cleaner look \*\/',
  '\/\* Ensure the swiper div takes priority \*\/',
  '\/\* Hide all orbit avatars by default on mobile \*\/',
  '\/\* Show only 4 smallest hints at corners for decoration \*\/',
  '\/\* Reposition them to safe corner zones \*\/',
  '\/\* Thin orbit rings \u2014 scale them down proportionally \*\/',
  '\/\* Reposition avatars inward so they don\x27t bleed off tablets \*\/',
  '\/\* Main content wrapper \*\/',
  '\/\* Heading: clamp for tablets \*\/',
  '\/\* Body text \*\/',
  '\/\* Heading block \*\/',
  '\/\* Reposition them to safe corner zones \*\/',
  '\/\* Drop the chandelier a little so it sits more naturally under the title \*\/',
  '\/\* Bring the stacked headline down into the visual middle on phones \*\/',
  '\/\* Lift the CTA so it sits below the headline instead of at the viewport edge \*\/',
  '\/\* Keep the floor curve anchored lower so the shorter hero still feels balanced \*\/',
  '\/\* Chandelier: slightly smaller so it doesn\x27t fill the entire width \*\/',
  '\/\* Tablet: shrink card widths so they fit \*\/',
  '\/\* Section vertical rhythm \*\/',
  '\/\* Section outer padding \u2014 tight on small screens \*\/',
  '\/\* Main content wrapper \*\/',
  '\/\* Heading block \*\/',
  '\/\* Central avatar \*\/',
  '\/\* Avatar outer glow ring \u2014 scale down \*\/',
  '\/\* Avatar circle itself \u2014 shrink from 96px \u2192 72px \*\/',
  '\/\* Swiper container \u2014 full width with no arrows \*\/',
  '\/\* Swiper pagination dots \*\/',
  '\/\* Orbit bubble avatars: hide large ones, keep tiny hints \*\/',
  '\/\* Decorative orbit rings \*\/',
  '\/\* Orbit avatars: show all but clip sizes \*\/',
  '\/\* Shared: section outer padding \*\/',
  '\/\* Testimonial card body \u2014 professional text arrangement \*\/',
  '\/\* Reduced motion: respect user preference \*\/',
  '\/\* Container padding and spacing \*\/',
  '\/\* Paragraph width \*\/',
  '\/\* Grid: Switch from 4-col to 2-col \*\/',
  '\/\* Hide empty placeholders on mobile to avoid grid gaps \*\/'
)

foreach ($pattern in $drop) {
  $c = [regex]::Replace($c, $pattern + '\s*\r?\n', '')
}

# ── 2. Annotate [style*=] selectors (fragile GSAP targets) ───────────────────
$c = [regex]::Replace(
  $c,
  '(?m)^(\s+)(\[style\*=)',
  '$1/* fragile: targets GSAP inline style — replace with class in future refactor */' + "`r`n" + '$1$2'
)

# ── 3. Clean up 3+ blank lines left by removed comments ──────────────────────
$c = [regex]::Replace($c, '(\r?\n){3,}', "`r`n`r`n")

Set-Content $file $c -NoNewline
Write-Host "Done."
