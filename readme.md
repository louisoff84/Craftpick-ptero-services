Français
Ce bot permet d'intégrer les fonctionnalités de votre panel Pterodactyl directement dans Discord. Gérez vos serveurs, surveillez les statuts et automatisez vos tâches via une interface simple.

📋 Prérequis
Node.js v16.x ou plus récent.

Un panel Pterodactyl fonctionnel.

Une application Discord créée via le Discord Developer Portal.

⚙️ Configuration
Ouvrez le fichier de configuration (souvent config.js ou index.js).

Remplissez les champs suivants dans l'objet CONFIG :

PANEL_URL: L'adresse URL complète de votre panel (ex: https://panel.monsite.com).

API_KEY: Votre clé API Administrateur (générée dans les paramètres de votre compte sur le panel).

BOT_TOKEN: Le token secret de votre bot Discord.

CLIENT_ID: L'ID de votre application Discord.

🚀 Installation
Bash
# Installer les dépendances
npm install

# Lancer le bot
node index.js
Attention : Ne partagez jamais votre API_KEY ou votre BOT_TOKEN publiquement.

English
This bot integrates your Pterodactyl panel features directly into Discord. Manage your servers, monitor status, and automate tasks through a simple interface.

📋 Prerequisites
Node.js v16.x or newer.

A working Pterodactyl panel.

A Discord application created via the Discord Developer Portal.

⚙️ Configuration
Open the configuration file (usually config.js or index.js).

Fill in the following fields in the CONFIG object:

PANEL_URL: Your panel's full URL (e.g., https://panel.mysite.com).

API_KEY: Your Administrator API key (generated in your account settings on the panel).

BOT_TOKEN: Your Discord bot's secret token.

CLIENT_ID: Your Discord application ID.

🚀 Installation
Bash
# Install dependencies
npm install

# Start the bot
node index.js
Warning: Never share your API_KEY or BOT_TOKEN publicly.

🛠️ Tech Stack
Language: JavaScript (Node.js)

API: Pterodactyl API & Discord.js

License: MIT
