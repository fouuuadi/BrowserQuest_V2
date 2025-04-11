
# BrowserQuest

**BrowserQuest** est une expérimentation de jeu multijoueur en HTML5/JavaScript.

## Participants

 - Fouad LAMNAOUAR  - Développeur Full Stack
 - Lissannou Modestin Hounga - Développeur Full Stack
 - Abbes Amine    - Développeur Full Stack

## 🚀 Lancement rapide via Docker

Ce projet fonctionne avec des images Docker.  
Assure-toi d'avoir **Docker** et **Docker Compose** installés et lancés avant de commencer.

### Étapes à suivre :

1. Cloner le dépôt :

- git clone https://github.com/fouuuadi/BrowserQuest_V2.git
- cd BrowserQuest_V2
- Lancer les container : docker-compose up ou 
- cd ./hebergement_docker : docker-compose up

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



## Ancien Readme

BrowserQuest
============

BrowserQuest is a HTML5/JavaScript multiplayer game experiment.


Documentation
-------------

Documentation is located in client and server directories.


License
-------

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.


Credits
-------
Created by [Little Workshop](http://www.littleworkshop.fr):

* Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
* Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)