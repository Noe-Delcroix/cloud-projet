# Projet Cloud

## RAF :
- [ ] Responsive
- [ ] Scroll infini sans le bouton
- [ ] Bot météo

- [ ] Schéma structure
- [ ] Analyse prévisionnelle des chiffres

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
