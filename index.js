const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName('vmuteall')
    .setDescription('Mute everyone in your voice channel'),

  new SlashCommandBuilder()
    .setName('vunmuteall')
    .setDescription('Unmute everyone in your voice channel')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
  }

  if (interaction.commandName === 'vmuteall') {
    for (const [id, member] of voiceChannel.members) {
      await member.voice.setMute(true);
    }
    await interaction.reply('Muted everyone in the voice channel.');
  }

  if (interaction.commandName === 'vunmuteall') {
    for (const [id, member] of voiceChannel.members) {
      await member.voice.setMute(false);
    }
    await interaction.reply('Unmuted everyone in the voice channel.');
  }
});

client.login(process.env.TOKEN);
