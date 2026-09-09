# Hors Budget

**Un Directeur de Projets. Une quête épique. Un budget Excel.**

Petit jeu d’arcade satirique en 3D, dans l’univers fictif d’INETUM. **DIRECTEUR DE PROJETS, Directeur de Projets**, cherche **BUSINESS MANAGER, Business Manager**, partie au Power UP Tour. Dans l’open space LCP7, il retrouve d’abord son bureau vide. Il traverse ensuite la **Direction Technologies Services Pays de la Loire**, où **DIRECTEUR TECHNOLOGIES SERVICES** bloque l’accès au rooftop avec ses KPI. Tout en haut, **DIRECTEUR RÉGION GRAND OUEST, Directeur Région Grand Ouest**, garde le budget final au milieu du séminaire.

## Jouer directement

**[Lancer Hors Budget dans le navigateur](https://c0sm0cats.github.io/hors-budget/)** — aucun téléchargement ni installation.

## Jouer hors ligne

Téléchargez le dépôt avec **Code → Download ZIP**, décompressez-le, puis ouvrez **index.html** par double-clic.

Le jeu est autonome : HTML, CSS, JavaScript, assets graphiques WebGL/PNG et sons synthétisés. Aucun serveur, installation, framework, fichier audio ni appel réseau. Navigateur récent avec WebGL recommandé : Chrome, Edge ou Firefox.

## Commandes

| Action | Clavier |
| --- | --- |
| Marcher | ← → ou Q / D (A / D également) |
| Grimper | ↑ ↓ ou Z / S (W / S également) |
| Sauter | Espace — maintenir pour sauter plus haut |
| Lancer un compte rendu / renvoyer un dossier | X |
| Pause | P ou Échap |

Des commandes tactiles sont disponibles sur petit écran.

## Les trois zones

- **Open Space · LCP7** : DIRECTEUR DE PROJETS, le bureau Business vide de BUSINESS MANAGER, consultants, commerciaux et outils du quotidien.
- **Direction TS · Pays de la Loire** : DIRECTEUR TECHNOLOGIES SERVICES, staffing, intercontrat, KPI, marge et objectifs.
- **Power UP Tour · Grand Ouest** : séminaire, espace VIP, DIRECTEUR RÉGION GRAND OUEST, coffre BUDGET et vraie libération de BUSINESS MANAGER.

## Au programme

- Deux populations lisibles visuellement : consultants plutôt casual (jean, baskets, tenues variées) et internes/business plus formels (vestes, costumes, tailleurs), avec plusieurs variantes de personnages.
- Punchlines adaptées aux métiers : mission, CRA et salaire côté consultants ; TJM, pipeline, CV et staffing côté business ; planning/COPIL pour DIRECTEUR DE PROJETS ; KPI/intercontrat pour DIRECTEUR TECHNOLOGIES SERVICES ; budget/région pour DIRECTEUR RÉGION GRAND OUEST.
- Signalétique différenciée : Ordre de mission, Swile, Chronotime, SAP Concur, MyPeopleDoc, Success Factors, GComp, Learning Academy, Power UP, Charity Day, Summer Party et autres références internes fictives.
- Imprimante à CRA, KPI, ascenseur du COMEX et petits fours volants selon les niveaux.
- Photocopieurs et buffet rebondissants pour prendre des raccourcis.
- Café accélérateur, **Bon de commande** protecteur et pluie de slides.
- Lire le tableau de BUSINESS MANAGER révèle sa destination et déclenche une réaction de DIRECTEUR DE PROJETS, une fois par partie.
- Des repères discrets signalent les tableaux et raccourcis utilisables à proximité ; ils restent fixes avec les animations réduites.
- DIRECTEUR TECHNOLOGIES SERVICES et DIRECTEUR RÉGION GRAND OUEST préparent visiblement leurs projectiles avant de tirer.
- Boss intermédiaire DIRECTEUR TECHNOLOGIES SERVICES : renvoyez ses KPI pour débloquer le rooftop.
- Boss final DIRECTEUR RÉGION GRAND OUEST : renvoyez ses dossiers lorsqu’il annonce « Bénéfices records » ; les deux premiers impacts sont des arbitrages, le dernier débloque réellement le budget.
- Chronos par zone, médailles et défis : Sans PowerPoint, Zéro réunion, Café uniquement, Sans une égratignure.
- Présentation arcade avec intros de niveaux, barre de vie du boss et finale « BUSINESS MANAGER EST LIBÉRÉE · BUDGET DÉBLOQUÉ ».
- Rare miracle : une vraie augmentation de 3 %, suivie de deux secondes d’applaudissements, projectiles compris.
- Dialogues ambiants limités à deux bulles sans chevauchement ; les réactions aux actions sont prioritaires.

Le fil narratif est volontairement unique : **retrouver la trace de BUSINESS MANAGER → franchir DIRECTEUR TECHNOLOGIES SERVICES → atteindre le Power UP Tour → battre DIRECTEUR RÉGION GRAND OUEST → débloquer le budget → libérer BUSINESS MANAGER**.

> **TOUT EST SOUS CONTRÔLE. MÊME LE BUDGET.**

Scores et palmarès sont stockés uniquement dans le navigateur (`localStorage`), lorsqu’il l’autorise. Ils ne sont pas synchronisés entre navigateurs ou appareils.

## Technique

Le jeu reste volontairement sans framework. `index.html` porte la structure, `style.css` et `polish.css` la présentation, et **`game.js` est le moteur canonique chargé directement par le navigateur**. Les modules JavaScript spécialisés complètent les décors, personnages, dialogues et finitions visuelles ; les assets graphiques, dont le poster du bureau de DIRECTEUR DE PROJETS, restent des fichiers dédiés. Il n’y a plus de loader XHR ni de réécriture du moteur par `eval` au démarrage.

Le rendu adapte automatiquement certains effets aux appareils plus modestes et respecte `prefers-reduced-motion` pour limiter les animations non essentielles.

Personnages et situations fictifs ; satire des clichés du conseil informatique.

### Tests de développement

Avec Node.js :

- `npm test` lance les tests de logique et les invariants de refonte ;
- `npm run test:e2e` lance les smoke tests Playwright desktop et mobile, dont le parcours canonique complet LCP7 → DIRECTEUR TECHNOLOGIES SERVICES → Power UP Tour → DIRECTEUR RÉGION GRAND OUEST → victoire, ainsi que pause/reprise, lecture des tableaux, commandes tactiles et ouverture hors ligne par `file://`.

Node.js n’est pas nécessaire pour jouer.
