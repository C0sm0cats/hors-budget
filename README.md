# Hors Budget

**Un directeur de projet. Une quête épique. Un budget Excel.**

Petit jeu d’arcade satirique en 3D, dans l’univers fictif d’INETUM. Kévin traverse l’open space, la direction et le rooftop du séminaire pour délivrer Charline. Rodolphe, le directeur, défend son budget à coups de dossiers.

## Jouer directement

**[Lancer Hors Budget dans le navigateur](https://c0sm0cats.github.io/hors-budget/)** — aucun téléchargement ni installation.

## Jouer hors ligne

Téléchargez le dépôt avec **Code → Download ZIP**, décompressez-le, puis ouvrez **index.html** par double-clic.

Le jeu est autonome : HTML, CSS, JavaScript, graphismes WebGL et sons synthétisés. Aucun serveur, installation, framework, fichier audio ni appel réseau. Navigateur récent avec WebGL recommandé : Chrome, Edge ou Firefox.

## Commandes

| Action | Clavier |
| --- | --- |
| Marcher | ← → ou Q / D (A / D également) |
| Grimper | ↑ ↓ ou Z / S (W / S également) |
| Sauter | Espace — maintenir pour sauter plus haut |
| Lancer un compte rendu / renvoyer un dossier | X |
| Pause | P ou Échap |

Des commandes tactiles sont disponibles sur petit écran.

## Au programme

- Trois décors : open space encombré, direction/COMEX, rooftop du séminaire.
- Junior poursuivant, senior aux benchmarks, syndicaliste à la pancarte +3 %.
- Imprimante à CRA, ascenseur du COMEX, petits fours volants.
- Photocopieurs et buffet rebondissants pour prendre des raccourcis.
- Café accélérateur, budget protecteur et pluie de slides.
- Tirs à ricochet, combos et boss final : renvoyez les dossiers de Rodolphe lorsqu’il annonce « Bénéfices records ».
- Chronos par zone, médailles et défis : Sans PowerPoint, Zéro réunion, Café uniquement, Sans une égratignure.
- Présentation arcade avec intros de niveaux, barre de vie du boss et finale « Budget débloqué ».

Scores et palmarès sont stockés uniquement dans le navigateur (`localStorage`), lorsqu’il l’autorise. Ils ne sont pas synchronisés entre navigateurs ou appareils.

## Technique

Le jeu reste volontairement sans dépendance : `index.html` porte la structure, `style.css` le style principal, `game.js` le moteur WebGL et la logique de jeu, tandis que `polish.css` et `polish.js` regroupent les finitions visuelles et d’interface.

Le rendu adapte automatiquement certains effets aux appareils plus modestes et respecte `prefers-reduced-motion` pour limiter les animations non essentielles.

Personnages et situations fictifs ; satire des clichés du conseil informatique.
