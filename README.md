# meliodash

Dashboard de contrôle des données d'un Raspberry Pi 5 : CPU, RAM, température, disque et réseau, consultable depuis un navigateur (mobile ou desktop).

Hébergé directement sur le Pi, exposé via **meliodash.rxdy.fr**.

## Stack

- **front/** — Vue 3 + TypeScript (Vite), servi en statique par Nginx
- **back/** — Node.js + TypeScript (Express + [systeminformation](https://systeminformation.io/)), expose `GET /api/metrics`
- **Docker Compose** pour orchestrer les deux services

```
navigateur → front (Nginx) ─┬─ sert le SPA
                             └─ proxy /api/* → back (Express)
```

Le service `back` tourne en `network_mode: host` : c'est nécessaire pour que `/api/metrics` reflète le vrai matériel du Pi (interfaces réseau, notamment) et non un réseau virtuel de container. Le `front` reste isolé sur le réseau Docker classique et joint le back via `host.docker.internal`.

## Lancer en local

```bash
docker compose up --build
```

- Dashboard : http://localhost:8081
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
- Sur push vers `main` uniquement : build et push des images sur GHCR (`ghcr.io/rxdy/meliodash-front`, `ghcr.io/rxdy/meliodash-back`), taguées `latest` et par SHA.

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
