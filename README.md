# Metryx

Dashboard de monitoring système : CPU, RAM, température, disque, réseau et containers Docker actifs, consultable depuis un navigateur (mobile ou desktop). Fonctionne sur n'importe quelle machine Linux — cette instance tourne sur un Raspberry Pi 5.

Hébergé directement sur le Pi, exposé via **metryx.rxdy.fr**.

## Fonctionnalités

- **Dashboard** — CPU, RAM, température, disque, réseau, en direct avec historique 5 min (graphiques Chart.js)
- **Alerte alimentation** — sous-tension / throttling (Raspberry Pi uniquement, masquée automatiquement ailleurs)
- **Page Containers** — liste les containers Docker actifs de la machine, groupés par projet `docker-compose`, avec statut par container. Protégée (voir Sécurité ci-dessous) car elle révèle les noms des projets hébergés.

## Stack

- **front/** — Vue 3 + TypeScript (Vite), Vue Router (2 vues : dashboard et containers), servi en statique par Nginx, graphiques via Chart.js
- **back/** — Node.js + TypeScript (Express + [systeminformation](https://systeminformation.io/) + [dockerode](https://github.com/apocas/dockerode)), expose `GET /api/metrics` et `GET /api/docker`
- **Docker Compose** pour orchestrer les services

```
navigateur → front (Nginx) ─┬─ sert le SPA
                             └─ proxy /api/* → back (Express)
```

Le service `back` tourne en `network_mode: host` : c'est nécessaire pour que `/api/metrics` reflète le vrai matériel de la machine (interfaces réseau, notamment) et non un réseau virtuel de container. Le `front` reste isolé sur le réseau Docker classique et joint le back via sa propre passerelle réseau, résolue dynamiquement au démarrage (voir `front/docker-entrypoint.sh`).

## Sécurité

- **Docker socket jamais exposé directement** — `back` n'a accès qu'à un [docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy) en lecture seule (`GET /containers` uniquement, pas de create/start/stop/exec). Un `back` compromis peut au pire lister les containers, jamais piloter le démon Docker.
- **`/docker` et `/api/docker` protégés** en production (Basic Auth + rate limiting via Traefik) — le reste du dashboard reste public, ces deux routes sont les seules à révéler des noms de projets hébergés.
- **Rate limiting calé sur l'usage réel** — la page Containers poll `/api/docker` en continu ; le seuil est fixé au-dessus de ce trafic légitime pour ne freiner que le bruteforce, pas l'usage normal.

## Lancer en local

```bash
docker compose up --build
```

- Dashboard : http://localhost:8081
- Page containers : http://localhost:8081/docker
- API brute : http://localhost:3001/api/metrics

## Développement

Chaque service a ses propres scripts npm :

```bash
cd front   # ou back
npm install
npm run dev         # serveur de dev
npm run lint         # ESLint
npm run typecheck    # vérification des types
npm test             # Vitest
npm run build         # build de prod
```

## CI/CD

Workflow GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) :

- Sur chaque push/PR vers `main` ou `dev` : lint + typecheck + tests (front et back).
- Sur push vers `main` uniquement : build et push des images sur GHCR (`ghcr.io/rxdy/metryx-front`, `ghcr.io/rxdy/metryx-back`), taguées `latest` et par SHA, en multi-arch (amd64 + arm64) pour tourner sur le Pi.

## Déploiement

Sur le Pi, `docker-compose.prod.yml` utilise les images publiées sur GHCR (au lieu de builder localement) et ajoute les labels Traefik (routage `metryx.rxdy.fr`, réseau externe `web`) et Watchtower (`com.centurylinklabs.watchtower.enable=true`) :

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Branches

- `main` — branche de prod, surveillée par [Watchtower](https://containrrr.dev/watchtower/) sur le Pi pour l'auto-déploiement des nouvelles images.
- `dev` — branche de travail.

## Structure

```
front/      Dashboard Vue 3 + TS
back/       API de métriques Node/TS
docker-compose.yml
tracking/   Suivi de projet (non versionné)
agent/      Contexte pour l'assistant IA (non versionné)
```
