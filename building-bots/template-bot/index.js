// Include necessary secrets
const { TOKEN } = require('./config.json');

// Import the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder } = require('discord.js');

//  Import the necessary discord-player classes
const { Player } = require('discord-player');
require('events').EventEmitter.defaultMaxListeners = 20;

// Import file system module for parsing commands
const fs = require('node:fs');
const path = require('node:path');


// Create a new bot client instance with the necessary intents for event handling
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});


// ================== DISCORD-PLAYER SETUP ==================
// client.player = new Player(client, {
// 	leaveOnEmpty: true
// });


// ================== COMMAND PARSING ==================

// Create a new Collection to store commands
// A Collection is similar to a Map, but with additional utility methods
// https://discord.js.org/docs/packages/collection/1.5.3/Collection:Class
// client.commands = new Collection();

// // Add the commands to the client.commands Collection using basic parsing of file system
// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		// Set a new item in the Collection with the key as the command name and the value as the exported module
// 		if ('data' in command && 'execute' in command) {
// 			client.commands.set(command.data.name, command);
// 		} else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// ================== BOT SETUP / COMMAND REGISTERING ==================
/*

When the client is ready:
- Log the bot client's username and tag
- Get all the guild ids
- Construct and prepare an instance of the REST module
- Deploy your commands using the REST module

*/
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}!`);

	// Get all ids of the servers
	const guild_ids = client.guilds.cache.map(guild => guild.id);

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(TOKEN);

	// await client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing application (/) commands for ${guild_ids.length} guilds.`);

			for (const guild_id of guild_ids) {
				let data = await rest.put(
					Routes.applicationGuildCommands(client.user.id, guild_id),
					{ body: client.commands.map(command => command.data.toJSON()) },
				);
				console.log(`Successfully reloaded ${data.length} application (/) commands for guild ${guild_id}.`);
			}
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
});


// ================== COMMAND EXECUTION ==================
/*

When the client receives an interaction:
- Check if the interaction is a chat input command
- Get the command from the client.commands Collection
- Execute the command
- Catch any errors and log them

*/
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	// console.log(interaction)

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute({ client, interaction });
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// ================== DISCORD-PLAYER EVENTS ==================

// Emitted when the player starts to play a song
// client.player.events.on('playerStart', async (queue, track) => {
// 	queue.metadata.send(`Started playing: **${track.title}** by **${track.author}**`);
// 	const embed = new EmbedBuilder()
// 		.setTitle(`NOW PLAYING\n${track.title} | ${track.author}`)
// 		.setDescription(`[${track.title}](${track.url})\nDuration: ${track.duration} | Description: ${track.description}`)
// 		.setThumbnail(track.thumbnail)

// 	// Send the embed
// 	queue.metadata.send({ embeds: [embed] });
// });

// // Emitted when the player adds a single song to its queue
// client.player.events.on('audioTrackAdd', async (queue, track) => {
// 	const queueLength = queue.tracks.toArray().length
// 	if (queueLength >= 0) {
// 		queue.metadata.send(`Track **${track.title}** queued`);
// 	}
// });

// // Emitted when the player adds multiple songs to its queue
// client.player.events.on('audioTracksAdd', async (queue, track) => {
// 	queue.metadata.send(`**${queue.tracks.toArray().length} songs** queued`);
// });

// // Emitted when the bot leaves the voice channel
// client.player.events.on('disconnect', async (queue) => {
// 	queue.metadata.send('Looks like my job here is done, leaving now!');
// });

// // Emitted when the voice channel has been empty for the set threshold
// // Bot will automatically leave the voice channel with this event
// client.player.events.on('emptyChannel', async (queue) => {
// 	queue.metadata.send(`Leaving because no vc activity for the past 5 minutes`);
// });

// // Emitted when the player queue has finished
// client.player.events.on('emptyQueue', async (queue) => {
// 	queue.metadata.send('Queue finished!');
// });

// // Emitted when the player sends debug info
// // Useful for seeing what dependencies, extractors, etc are loaded
// client.player.on('debug', async (message) => {
// 	console.log(`General player debug event: ${message}`);
// });

// // Emitted when the player queue sends debug info
// // Useful for seeing what state the current queue is at
// client.player.events.on('debug', async (queue, message) => {
// 	console.log(`Player debug event: ${message}`);
// });

// // Emitted when the player queue encounters error
// client.player.events.on('error', async (queue, error) => {
// 	console.log(`General player error event: ${error.message}`);
// 	// console.log(error);
// });

// // Emitted when the audio player errors while streaming audio track
// client.player.events.on('playerError', async (queue, error) => {
// 	console.log(`Player error event: ${error.message}`);
// 	// console.log(error);
// });

// ================== LOGIN ==================
// Login to Discord with your app's token
client.login(TOKEN);
