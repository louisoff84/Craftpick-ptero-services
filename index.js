const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const crypto = require('crypto');

// --- Configuration avec tes accès ---
const CONFIG = {
    PANEL_URL: "PTERODACTYL_URL_HERE", // Remplace par l'URL de ton panel Pterodactyl // Replace with the URL of your Pterodactyl panel
    API_KEY: "PTERODACTYL_API_KEY_HERE", // Remplace par ta clé API d'administrateur Pterodactyl // Replace with your Pterodactyl admin API key
    BOT_TOKEN: "PTERODACTYL_BOT_TOKEN_HERE", // Remplace par le token de ton bot Discord // Replace with your Discord bot token
    CLIENT_ID: "PTERODACTYL_CLIENT_ID_HERE" // Remplace par l'ID de ton application Discord // Replace with your Discord application ID
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const generatePassword = () => {
    const length = 12;
    const charset = "dfqsfkjhqsdjlkfdskjdfsgfijksdfsdjfklqsg t;:!;:!:n,:!,;:!,;:!,;:!:!,;:!n:!;:;!$**ùù*^m*ù*mdgfcvdoz,rlmfv,";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

// Enregistrement de la commande /create_user
const commands = [
    new SlashCommandBuilder()
        .setName('create_user')
        .setDescription('Créer un compte sur le panel Pterodactyl')
        .addUserOption(option => 
            option.setName('membre')
                .setDescription('L\'utilisateur à qui appartient le compte')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('email')
                .setDescription('L\'adresse email pour la création du compte')
                .setRequired(true)),
];

const rest = new REST({ version: '10' }).setToken(CONFIG.BOT_TOKEN);

(async () => {
    try {
        console.log('🔄 Enregistrement des commandes slash...');
        await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), { body: commands });
        console.log('✅ Commande /create_user enregistrée !');
    } catch (error) {
        console.error('❌ Erreur d\'enregistrement :', error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'create_user') {
        
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: "❌ Tu dois être administrateur pour utiliser cette commande.", ephemeral: true });
        }

        const userDiscord = interaction.options.getUser('membre');
        const email = interaction.options.getString('email');
        const password = generatePassword();

        await interaction.deferReply({ ephemeral: true });

        
        const payload = {
            username: userDiscord.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
            email: email,
            first_name: userDiscord.globalName || userDiscord.username,
            last_name: "Discord",
            password: password
        };

        try {
            const response = await axios.post(`${CONFIG.PANEL_URL}/api/application/users`, payload, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
            });

            if (response.status === 201) {
                
                const mpEmbed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('🎮 Bienvenue sur Craftpick hosting!')
                    .setDescription('Ton compte a été créé avec succès par un administrateur.')
                    .addFields(
                        { name: '🌐 URL du Panel', value: CONFIG.PANEL_URL },
                        { name: '📧 Email de connexion', value: `\`${email}\`` },
                        { name: '🔑 Mot de passe ', value: `\`${password}\`` }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({ text: 'Conseil : Change ton mot de passe après ta première connexion.' })
                    .setTimestamp();

                try {
                    await userDiscord.send({ embeds: [mpEmbed] });
                    await interaction.editReply({ content: `✅ Compte créé pour **${userDiscord.tag}**. Les accès lui ont été envoyés en MP.` });
                } catch (err) {
                    await interaction.editReply({ content: `⚠️ Compte créé sur le panel, mais je n'ai pas pu envoyer de MP à ${userDiscord.tag} (ses MP sont peut-être fermés).` });
                }
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.errors?.[0]?.detail || "Erreur inconnue lors de l'appel API.";
            await interaction.editReply({ content: `❌ Erreur lors de la création du compte : \`${errorMsg}\`` });
        }
    }
});

client.once('ready', () => {
    console.log(`🚀 Bot connecté en tant que ${client.user.tag}`);
});

client.login(CONFIG.BOT_TOKEN);
