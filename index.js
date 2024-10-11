javascript
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();

// Configuración del bot
const config = require('./config.json');
const TOKEN = config.token;

// Eventos de Discord
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'boot') {
    if (!args[0]) {
      return message.reply('Debe proporcionar la IP y el puerto de la partida');
    }
    const ipAndPort = args[0].split(':');
    if (ipAndPort.length !== 2) {
      return message.reply('Debe proporcionar la IP y el puerto de la partida en formato IP:PUERTO');
    }
    const ip = ipAndPort[0];
    const port = parseInt(ipAndPort[1], 10);
    if (isNaN(port) || port < 0 || port > 65535) {
      return message.reply('El puerto debe ser un número entre 0 y 65535');
    }

    // Envía paquetes de prueba a la IP y puerto de la partida
    const response = await axios.get(`http://${ip}:${port}/`);
    if (response.status !== 200) {
      return message.reply(`No se pudo conectar a la IP ${ip} y puerto ${port}`);
    }
    message.reply(`Se ha enviado un paquete de prueba a la IP ${ip} y puerto ${port}`);
  }
});

// Inicia el bot
client.login(TOKEN);
app.listen(3000, () => console.log('Express server started on port 3000'));
