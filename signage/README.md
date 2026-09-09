# Affiches du décor

Les PNG de ce dossier sont les sources utilisées par le site web.

Après leur remplacement, exécuter `python3 scripts/generate-offline-signage.py` (Pillow requis) et committer `signage-offline.js`. Ce fichier contient des variantes PNG à demi-résolution, optimisées en palette de 256 couleurs, pour le lancement par double-clic sur `index.html`. Il n'est chargé qu'en `file://` : les fichiers PNG locaux ne peuvent pas être utilisés directement comme textures WebGL sans contaminer le canvas.
