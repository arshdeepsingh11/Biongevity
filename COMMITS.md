# Commit history — one commit per change

Run these from the project root after unzipping. Every path is quoted, so zsh and bash both handle the `[dept]` / `[handle]` folders.

## 0. One-time setup
```bash
git init
git branch -M main
git remote add origin https://github.com/arshdeepsingh11/Biogenvity.git
```

> Shortcut: `bash scripts/commit-all.sh` runs all the commits below in order. Or paste them one by one:

## 1. chore: scaffold Next.js 15 + React 19 + TypeScript project
```bash
git add "package.json" "package-lock.json" "tsconfig.json" "next.config.ts" ".gitignore" ".env.example"
git commit -m "chore: scaffold Next.js 15 + React 19 + TypeScript project"
```

## 2. style: add Tailwind design tokens, DM Sans font and global styles
```bash
git add "tailwind.config.ts" "postcss.config.mjs" "src/app/globals.css"
git commit -m "style: add Tailwind design tokens, DM Sans font and global styles"
```

## 3. chore(mobile): add Capacitor config for iOS and Android
```bash
git add "capacitor.config.ts"
git commit -m "chore(mobile): add Capacitor config for iOS and Android"
```

## 4. feat(ui): add utilities, icon set and Icon component
```bash
git add "src/lib/utils.ts" "src/components/ui/icons.ts" "src/components/ui/Icon.tsx"
git commit -m "feat(ui): add utilities, icon set and Icon component"
```

## 5. feat(data): add Biongevity site, departments, packages and care content
```bash
git add "src/data/types.ts" "src/data/site.ts" "src/data/health.ts"
git commit -m "feat(data): add Biongevity site, departments, packages and care content"
```

## 6. feat(data): add BioAro Labs catalog (47 tests, 9 categories)
```bash
git add "src/data/labs.ts"
git commit -m "feat(data): add BioAro Labs catalog (47 tests, 9 categories)"
```

## 7. feat(data): add BioAro Drugs catalog, goals, personas and protocol builder rules
```bash
git add "src/data/drugs.ts"
git commit -m "feat(data): add BioAro Drugs catalog, goals, personas and protocol builder rules"
```

## 8. feat(data): add journal, demo dashboard data, catalog index and media slots
```bash
git add "src/data/journal.ts" "src/data/dashboard.ts" "src/data/catalog.ts" "src/config/media.ts" "public/media/.gitkeep"
git commit -m "feat(data): add journal, demo dashboard data, catalog index and media slots"
```

## 9. feat(shopify): add Storefront API client, GraphQL queries, types and product adapter
```bash
git add "src/lib/shopify/client.ts" "src/lib/shopify/queries.ts" "src/lib/shopify/types.ts" "src/lib/shopify/index.ts"
git commit -m "feat(shopify): add Storefront API client, GraphQL queries, types and product adapter"
```

## 10. feat(commerce): add cart provider with Shopify cart and local demo fallback
```bash
git add "src/components/commerce/CartProvider.tsx"
git commit -m "feat(commerce): add cart provider with Shopify cart and local demo fallback"
```

## 11. feat(hooks): add useInView, useReducedMotion and useShopifyCatalog
```bash
git add "src/hooks/useInView.ts" "src/hooks/useReducedMotion.ts" "src/hooks/useShopifyCatalog.ts"
git commit -m "feat(hooks): add useInView, useReducedMotion and useShopifyCatalog"
```

## 12. feat(fx): add DecodeText, MorphingText, Text3DFlip, NumberTicker and KeywordStream
```bash
git add "src/components/fx/DecodeText.tsx" "src/components/fx/MorphingText.tsx" "src/components/fx/Text3DFlip.tsx" "src/components/fx/NumberTicker.tsx" "src/components/fx/KeywordStream.tsx"
git commit -m "feat(fx): add DecodeText, MorphingText, Text3DFlip, NumberTicker and KeywordStream"
```

## 13. feat(fx): add ShineBorder, ProgressRing, AnimatedList, Terminal and BentoGrid
```bash
git add "src/components/fx/ShineBorder.tsx" "src/components/fx/ProgressRing.tsx" "src/components/fx/AnimatedList.tsx" "src/components/fx/Terminal.tsx" "src/components/fx/BentoGrid.tsx"
git commit -m "feat(fx): add ShineBorder, ProgressRing, AnimatedList, Terminal and BentoGrid"
```

## 14. feat(fx): add EvervaultCard and Confetti
```bash
git add "src/components/fx/EvervaultCard.tsx" "src/components/fx/Confetti.ts"
git commit -m "feat(fx): add EvervaultCard and Confetti"
```

## 15. feat(fx): add Focused 3D Marquee, Apple Dock and Dynamic Navigation
```bash
git add "src/components/fx/FocusedMarquee.tsx" "src/components/fx/AppleDock.tsx" "src/components/fx/DynamicNav.tsx"
git commit -m "feat(fx): add Focused 3D Marquee, Apple Dock and Dynamic Navigation"
```

## 16. feat(fx): add 3D Cards Carousel and GSAP Scroll Rotate sphere gallery
```bash
git add "src/components/fx/CoverflowCarousel.tsx" "src/components/fx/ScrollSphereGallery.tsx"
git commit -m "feat(fx): add 3D Cards Carousel and GSAP Scroll Rotate sphere gallery"
```

## 17. feat(fx): add Beam Flow WebGL shader, Globe and Video Text
```bash
git add "src/components/fx/BeamFlow.tsx" "src/components/fx/Globe.tsx" "src/components/fx/VideoText.tsx"
git commit -m "feat(fx): add Beam Flow WebGL shader, Globe and Video Text"
```

## 18. feat(fx): add three.js Planet System and Signal Convergence
```bash
git add "src/components/fx/PlanetSystem.tsx" "src/components/fx/SignalConvergence.tsx"
git commit -m "feat(fx): add three.js Planet System and Signal Convergence"
```

## 19. feat(ai): add Biongevity AI assistant, scroll HUD and touch/scroll interaction layer
```bash
git add "src/components/ai/knowledge.ts" "src/components/ai/AIProvider.tsx" "src/components/ai/AIAssistant.tsx" "src/components/ai/AIHud.tsx" "src/components/ai/AIInteractionLayer.tsx"
git commit -m "feat(ai): add Biongevity AI assistant, scroll HUD and touch/scroll interaction layer"
```

## 20. feat(layout): add header, mobile dock, footer, media slots and section helpers
```bash
git add "src/components/layout/Header.tsx" "src/components/layout/MobileDock.tsx" "src/components/layout/Footer.tsx" "src/components/ui/MediaSlot.tsx" "src/components/ui/Section.tsx"
git commit -m "feat(layout): add header, mobile dock, footer, media slots and section helpers"
```

## 21. feat(commerce): add cart drawer, add-to-bag, product card, catalog browser and product detail
```bash
git add "src/components/commerce/CartDrawer.tsx" "src/components/commerce/AddToCart.tsx" "src/components/commerce/ProductCard.tsx" "src/components/commerce/CatalogBrowser.tsx" "src/components/commerce/ProductDetail.tsx"
git commit -m "feat(commerce): add cart drawer, add-to-bag, product card, catalog browser and product detail"
```

## 22. feat(app): add root layout and providers
```bash
git add "src/app/layout.tsx" "src/app/providers.tsx"
git commit -m "feat(app): add root layout and providers"
```

## 23. feat(home): add home page with hero beam, 360° signal view, marquee, BioELR layer and bento
```bash
git add "src/components/home/HomeSections.tsx" "src/app/page.tsx"
git commit -m "feat(home): add home page with hero beam, 360° signal view, marquee, BioELR layer and bento"
```

## 24. feat(precision-health): add departments, AI triage and 11 department pages
```bash
git add "src/components/pages/Triage.tsx" "src/components/pages/AskButton.tsx" "src/app/precision-health/page.tsx" "src/app/precision-health/[dept]/page.tsx"
git commit -m "feat(precision-health): add departments, AI triage and 11 department pages"
```

## 25. feat(packages): add Core, Plus and Elite comparison page
```bash
git add "src/app/packages/page.tsx"
git commit -m "feat(packages): add Core, Plus and Elite comparison page"
```

## 26. feat(labs): add BioAro Labs page, test sphere, tests shop and 47 test pages
```bash
git add "src/components/pages/LabsExplorer.tsx" "src/app/labs/page.tsx" "src/app/labs/tests/page.tsx" "src/app/labs/tests/[handle]/page.tsx"
git commit -m "feat(labs): add BioAro Labs page, test sphere, tests shop and 47 test pages"
```

## 27. feat(drugs): add BioAro Drugs page, AI protocol builder, shop and product pages
```bash
git add "src/components/pages/ProtocolBuilder.tsx" "src/components/pages/DrugsSections.tsx" "src/app/drugs/page.tsx" "src/app/drugs/shop/page.tsx" "src/app/drugs/products/[handle]/page.tsx"
git commit -m "feat(drugs): add BioAro Drugs page, AI protocol builder, shop and product pages"
```

## 28. feat(pages): add Journey, Life, Clinic and ELR App pages
```bash
git add "src/app/journey/page.tsx" "src/app/life/page.tsx" "src/app/clinic/page.tsx" "src/components/pages/AppDock.tsx" "src/app/app/page.tsx"
git commit -m "feat(pages): add Journey, Life, Clinic and ELR App pages"
```

## 29. feat(pages): add Journal and About pages
```bash
git add "src/components/pages/JournalList.tsx" "src/app/journal/page.tsx" "src/app/about/page.tsx"
git commit -m "feat(pages): add Journal and About pages"
```

## 30. feat(pages): add Contact form with AI routing
```bash
git add "src/components/pages/ContactForm.tsx" "src/app/contact/page.tsx"
git commit -m "feat(pages): add Contact form with AI routing"
```

## 31. feat(dashboard): add demo member dashboard (overview, biomarkers, genome, plan, visits, reports)
```bash
git add "src/components/pages/Dashboard.tsx" "src/app/dashboard/page.tsx"
git commit -m "feat(dashboard): add demo member dashboard (overview, biomarkers, genome, plan, visits, reports)"
```

## 32. feat(cart): add cart page and 404 page
```bash
git add "src/components/pages/CartView.tsx" "src/app/cart/page.tsx" "src/app/not-found.tsx"
git commit -m "feat(cart): add cart page and 404 page"
```

## 33. docs: add README and commit history guide
```bash
git add "README.md" "COMMITS.md" "scripts/commits.txt" "scripts/commit-all.sh"
git commit -m "docs: add README and commit history guide"
```

## Push
```bash
git push -u origin main
```

## Future changes
Keep the same style: one logical change per commit, with a conventional prefix (`feat`, `fix`, `style`, `chore`, `docs`, `refactor`) and a scope, e.g. `feat(labs): add test quiz`.
