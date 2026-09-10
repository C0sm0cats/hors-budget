# Hors Budget

**Un Directeur de Projets. Une quête épique. Un budget Excel.**

Petit jeu d’arcade satirique en 3D, dans l’univers fictif d’INETUM. Tu incarnes le **Directeur de Projets**. Le budget s’est perdu quelque part entre l’open space et le Power UP Tour, où le prochain atelier dure six heures. Les salariés attendent une augmentation : à toi de remonter sa piste, de traverser la direction et de débloquer le budget pour tout le monde.

Le parcours suit trois étapes : les premiers indices dans l’open space LCP7, l’accès au rooftop gardé par le **Directeur Technologies Services Pays de la Loire**, puis le budget détenu par le **Directeur Région Grand Ouest** au séminaire.
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

- **Open Space · LCP7** : retrouve les premiers indices sur le budget parmi les consultants, les commerciaux et les outils du quotidien.
- **Direction TS · Pays de la Loire** : renvoie les KPI du Directeur Technologies Services Pays de la Loire pour ouvrir l’accès au rooftop.
- **Power UP Tour · Grand Ouest** : affronte le Directeur Région Grand Ouest et débloque le budget pour tous les salariés.

## Au programme

- Deux populations lisibles visuellement : consultants plutôt casual (jean, baskets, tenues variées) et internes/business plus formels (vestes, costumes, tailleurs), avec plusieurs variantes de personnages.
- Punchlines adaptées aux métiers : mission, CRA et salaire côté consultants ; TJM, pipeline, CV et staffing côté business ; planning/COPIL pour le Directeur de Projets ; KPI/intercontrat pour le Directeur Technologies Services Pays de la Loire ; budget/région pour le Directeur Région Grand Ouest.
- Signalétique différenciée : Ordre de mission, Swile, Chronotime, SAP Concur, MyPeopleDoc, Success Factors, GComp, Learning Academy, Power UP, Charity Day, Summer Party et autres références internes fictives.
- Imprimante à CRA, KPI, ascenseur du COMEX et petits fours volants selon les niveaux.
- Photocopieurs et buffet rebondissants pour prendre des raccourcis.
- Café accélérateur, **Bon de commande** protecteur et pluie de slides.
- Lire le tableau commercial révèle la prochaine étape et déclenche une réaction du Directeur de Projets, une fois par partie.
- Des repères discrets signalent les tableaux et raccourcis utilisables à proximité ; ils restent fixes avec les animations réduites.
- Les deux boss préparent visiblement leurs projectiles avant de tirer.
- Boss intermédiaire — Directeur Technologies Services Pays de la Loire : renvoyez ses KPI pour débloquer le rooftop.
- Boss final — Directeur Région Grand Ouest : renvoyez ses dossiers lorsqu’il annonce « Bénéfices records » ; les deux premiers impacts sont des arbitrages, le dernier débloque réellement le budget.
- Chronos par zone, médailles et défis : Sans PowerPoint, Zéro réunion, Café uniquement, Sans une égratignure.
- Présentation arcade avec intros de niveaux, barre de vie du boss et finale « MISSION ACCOMPLIE · BUDGET DÉBLOQUÉ ».
- Rare miracle : une vraie augmentation de 3 %, suivie de deux secondes d’applaudissements, projectiles compris.
- Dialogues ambiants limités à deux bulles sans chevauchement ; les réactions aux actions sont prioritaires. Les fonctions restent sur les plaques de bureau, sans étiquette au-dessus des personnages.

L’objectif reste le même tout au long de la partie : **remonter la piste du budget → ouvrir l’accès au rooftop → débloquer le budget pour tous**.

> **TOUT EST SOUS CONTRÔLE. MÊME LE BUDGET.**

Scores et palmarès sont stockés uniquement dans le navigateur (`localStorage`), lorsqu’il l’autorise. Ils ne sont pas synchronisés entre navigateurs ou appareils.

## Technique

Le jeu reste volontairement sans framework. `index.html` porte la structure, `style.css` et `polish.css` la présentation, et **`game.js` est le moteur canonique chargé directement par le navigateur**. Les modules JavaScript spécialisés complètent les décors, personnages, dialogues et finitions visuelles ; les assets graphiques, dont le poster du bureau du Directeur de Projets, restent des fichiers dédiés. Il n’y a plus de loader XHR ni de réécriture du moteur par `eval` au démarrage.

Le rendu adapte automatiquement certains effets aux appareils plus modestes et respecte `prefers-reduced-motion` pour limiter les animations non essentielles.

Personnages et situations fictifs ; satire des clichés du conseil informatique.
