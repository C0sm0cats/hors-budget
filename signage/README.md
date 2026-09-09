# Affiches du décor

Les PNG de ce dossier sont les sources utilisées par le site web.

Après leur remplacement, exécuter `python3 scripts/generate-offline-signage.py` (Pillow requis) et committer `signage-offline.js`. Ce fichier contient des variantes PNG à demi-résolution, optimisées en palette de 256 couleurs, pour le lancement par double-clic sur `index.html`. Il n'est chargé qu'en `file://` : les fichiers PNG locaux ne peuvent pas être utilisés directement comme textures WebGL sans contaminer le canvas.

## Tableaux des personnages

Les fichiers fournis sont conservés sans modification :

- `Whiteboard01.png` : CHACHA — Business & Développement, niveau 1, étage 2.
- `Whiteboard02.png` : KÉKÉ — Projets & Delivery, niveau 1, étage 1.
- `Whiteboard03.png` : JUJU — Technologies & Services, niveau 2, étage 1.
- `Whiteboard04.png` : RORO — Région Grand Ouest, niveau 3, étage 3.

Après leur remplacement, exécuter `python3 scripts/generate-offline-whiteboards.py` pour actualiser `whiteboards-offline.js`. Ce bundle conserve la résolution native et la transparence pour le mode hors ligne. Le mode lecture utilise l'image complète et propose un agrandissement à taille native.

## Panneaux spéciaux

`cooptation.png` remplace la cooptation près de KÉKÉ au niveau 1. `POWER_UP_TOUR.png` et `espace_VIP.png` remplacent les deux enseignes du séminaire au niveau 3, aux étages 1 et 2 respectivement. Les fichiers sont conservés intacts ; `special-signage.js` utilise les limites du dessin visible pour ne pas dimensionner les panneaux à partir des marges transparentes.

Après remplacement de ces sources, vérifier leurs limites visibles dans `special-signage.js` et exécuter `python3 scripts/generate-offline-special-signage.py` pour actualiser le bundle hors ligne.
