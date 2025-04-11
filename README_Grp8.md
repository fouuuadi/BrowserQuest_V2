
## Étape 1 : Déploiement Docker

- Création des images *front* et *back*, ainsi que d’une image *Nginx* pour gérer le load balancing et le failover.  
- Mise en ligne des images sur DockerHub.

---

## Étape 3 : Mise en place d'un Load Balancer

- Utilisation de Nginx pour réaliser cette étape.

---

## Étape 4 : Haute Disponibilité et Failover

- Configuration pour qu’un utilisateur se connecte au serveur ayant la charge la plus faible.  
- Mise en place d’un système qui, lorsqu’une des 3 instances plante, redirige l’utilisateur vers une autre instance fonctionnelle.

## Étape 5 : Optimisation des Performances

- Mise à jour de certains packages obsolètes (notamment *websocket-server*).  
- Remplacement du code obsolète `log.info` par `console.log` côté serveur.  
- Mise à jour du WebSocket.

---

## Étape 6 : Sécurisation de l'Application

- Création d’une sécurité avant d’accéder à la page (Code : `0000`).

---

