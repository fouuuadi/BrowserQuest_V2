# Tâche réalisée par Modestin et Fouad

# Installation de Homebrew et Nginx

1. **Installation optionnelle de Homebrew**

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

1. **Installation de Nginx**
    ```bash
    brew install nginx
2. **Édition du fichier de configuration Nginx**
    ```bash
    nano /opt/homebrew/etc/nginx/nginx.conf 
3. **Vérifier l'état des services**
    ```bash
    brew services list
4. **Démarrer le serveur Nginx**
    ```bash
    brew services start nginx
5. **Tester la configuration Nginx**
    ```bash
    nginx -t
6. **Afficher les logs d'erreurs**
    ```bash
    tail -n 20 /opt/homebrew/var/log/nginx/error.log
    
    tail : C'est une commande Unix utilisée pour afficher la fin d'un fichier.

    -n 20 : Ce paramètre indique à tail d'afficher les 20 dernières lignes.
7. **Installation optionnelle de Homebrew**
    ```bash
    brew services restart nginx

