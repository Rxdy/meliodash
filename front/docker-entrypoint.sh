#!/bin/sh
set -e

# back tourne en network_mode: host (pour voir les vraies métriques du Pi,
# pas celles du container). Ce front n'est que sur le réseau "web" (pour
# Traefik) : on résout sa propre passerelle par défaut, seule adresse
# garantie pour joindre l'hôte quel que soit le nom/sous-réseau du réseau.
BACKEND_HOST=$(ip route | awk '/^default/ { print $3; exit }')
export BACKEND_HOST

# Surchargeable : sur un hôte où plusieurs services network_mode:host se
# partagent l'espace de ports, back peut tourner sur un port autre que 3001.
BACKEND_PORT="${BACKEND_PORT:-3001}"
export BACKEND_PORT

envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
