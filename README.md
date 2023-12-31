# Projet Cloud - IMT 2e année

## Description du projet
Projet de cloud consistant en une application web permettant d'envoyer des messages.

Lien du site déployé sur s3 : http://s3-thunder-web.s3-website-eu-west-1.amazonaws.com/

## Architecture du projet

![schema architecture](./resources/schéma-architecture.png)
Schéma de l'architecture AWS du projet

## Configuration

### .env
Fichier .env a la racine du projet requis pour l'authentification Cognito. Il doit contenir :
```
REACT_APP_COGNITO_USER_POOL_ID=<id de la pool cognito>
REACT_APP_COGNITO_CLIENT_ID=<id client de l'application>
```

## Lancement du projet

### En local
```
npm install
npm run start
```

### Deploiement sur le bucket S3

Il faut au préalable avoir installé le CLI AWS et configuré les credentials ainsi que la région.
Commandes pour configurer le CLI :
```
aws configure
```
AWS Access Key ID : `<clé API>`\
AWS Secret Access Key :`<clé API secrète>`\
Default region name : `eu-west-1`

Commande pour déployer le projet sur le bucket S3 :
```
npm run deploy
```
