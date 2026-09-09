# Plaques de bureau

Les quatre PNG sont générés par `node scripts/generate-office-plaques.cjs` (Playwright/Chromium et Python/Pillow requis pour la génération uniquement).

Les plaques affichent uniquement les fonctions d’origine, sans nom ni surnom.

Les dimensions suivent les limites réelles des glyphes, avec 22 pixels de marge intérieure avant export ×2. La densité de 260 pixels par unité de jeu conserve une typographie et des espacements identiques entre personnages. Les fonctions longues passent sur plusieurs lignes.

Le script produit également `office-plaques-data.js`, qui embarque les mêmes PNG optimisés en palette de 128 couleurs. Le jeu utilise ces données pour éviter toute requête supplémentaire et toute contamination des textures WebGL en `file://`.
