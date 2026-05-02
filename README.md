# ABC-LUX

Luxury architectural and decorative lighting experience built as a production React application.

## Tech Stack

- React
- TypeScript
- Vite
- TanStack Router
- GSAP
- Tailwind CSS
- Lenis

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Deployment

The project is hosted on Vercel and auto-deploys from the main branch.

## Folder Structure

```text
src/
  main.tsx
  responsive.css
  router.tsx
  routeTree.gen.ts
  styles.css
  assets/
    fonts/
  components/
    lux/
      Blogs.tsx
      Collections.tsx
      Contact.tsx
      Feedback.tsx
      Footer.tsx
      Hero.tsx
      LightDark.tsx
      MenuOverlay.tsx
      Nav.tsx
      Products.tsx
      WhyChooseUs.tsx
    ui/
      accordion.tsx
      alert-dialog.tsx
      alert.tsx
      aspect-ratio.tsx
      avatar.tsx
      badge.tsx
      breadcrumb.tsx
      button.tsx
      calendar.tsx
      card.tsx
      carousel.tsx
      chart.tsx
      checkbox.tsx
      collapsible.tsx
      command.tsx
      context-menu.tsx
      CursorTrail.tsx
      dialog.tsx
      drawer.tsx
      dropdown-menu.tsx
      form.tsx
      hover-card.tsx
      input-otp.tsx
      input.tsx
      label.tsx
      menubar.tsx
      navigation-menu.tsx
      pagination.tsx
      popover.tsx
      Preloader.tsx
      progress.tsx
      radio-group.tsx
      resizable.tsx
      scroll-area.tsx
      select.tsx
      separator.tsx
      sheet.tsx
      sidebar.tsx
      skeleton.tsx
      slider.tsx
      sonner.tsx
      switch.tsx
      table.tsx
      tabs.tsx
      textarea.tsx
      TitleReveal.tsx
      toggle-group.tsx
      toggle.tsx
      tooltip.tsx
  hooks/
    use-mobile.tsx
    useLenis.ts
    useMagnetic.ts
    usePreloader.tsx
  lib/
    utils.ts
  routes/
    __root.tsx
    article-1.tsx
    article-2.tsx
    article-3.tsx
    index.tsx
```

## Notes

- `responsive.css` intentionally uses `!important` overrides to beat GSAP inline styles on mobile. Do not remove these without refactoring the GSAP animations first.
- GSAP plugins are currently registered in multiple files; centralizing registration is planned as a Phase 3 improvement.