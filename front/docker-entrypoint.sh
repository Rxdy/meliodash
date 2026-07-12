#!/bin/sh
set -e

# back tourne en network_mode: host (pour voir les vraies métriques du Pi,
# pas celles du container). Ce front n'est que sur le réseau "web" (pour
# Traefik) : on résout sa propre passerelle par défaut, seule adresse
# garantie pour joindre l'hôte quel que soit le nom/sous-réseau du réseau.
BACKEND_HOST=$(ip route | awk '/^default/ { print $3; exit }')
export BACKEND_HOST

envsubst '${BACKEND_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
