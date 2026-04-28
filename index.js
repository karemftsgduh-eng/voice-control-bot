require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

// الأوامر
const commands = [
  new SlashCommandBuilder()
    .setName('muteall')
    .setDescription('Mute everyone in voice channel'),

  new SlashCommandBuilder()
    .setName('unmuteall')
    .setDescription('Unmute everyone in voice channel')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Commands registered');
  } catch (err) {
    console.error(err);
  }
});

// التنفيذ
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member;
  const voice = member.voice.channel;

  if (!voice) {
    return interaction.reply({ 
      content: 'لازم تكون داخل روم صوتي', 
      ephemeral: true 
    });
  }

  // mute all
  if (interaction.commandName === 'muteall') {
    voice.members.forEach(async (m) => {
      try {
        await m.voice.setMute(true);
      } catch (e) {}
    });

    return interaction.reply('تم كتم الجميع 🔇');
  }

  // unmute all
  if (interaction.commandName === 'unmuteall') {
    voice.members.forEach(async (m) => {
      try {
        await m.voice.setMute(false);
      } catch (e) {}
    });

    return interaction.reply('تم فك كتم الجميع 🔊');
  }
});

client.login(process.env.TOKEN);
