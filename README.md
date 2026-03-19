# KiKéOU

## Présentation du projet

KiKéOU est une application web en temps réel qui permet de partager sa localisation avec ses proches de manière simple et rapide. Le projet est construit avec une architecture **client/serveur** :

- un **frontend React + TypeScript** pour l’interface utilisateur,
- un **backend Node.js + Express + Socket.IO** pour la communication temps réel,
- une couche de services pour la gestion des utilisateurs et des données.

L’objectif principal est d’offrir une expérience fluide pour afficher les membres des équipes présentes

Ce dépôt est organisé en deux parties :

- `client/` : application web (UI, pages, composants),
- `server/` : API et logique temps réel.

Le projet est pensé pour être facilement maintenable et extensible, avec une séparation claire entre l’interface, les routes API et les services métier.
