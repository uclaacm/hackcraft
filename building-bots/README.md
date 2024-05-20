# Building Bots Spring 2024

Welcome to the repository for Hack's spring 2024 workshop building bots.
In this repository, we have two folders, one containing the completed bot code and the other with code commented out to provide a template to follow along.

It is highly suggested that you take the time to understand the code and understand the core concepts at a little bit deeper of a level.
A lot of this is boilerplate, but boilerplate can still be overlooked and misunderstood.

Anyways...
The slides for the workshop are here:
**[BUILDING BOTS SLIDES](https://docs.google.com/presentation/d/1_q-LOXpkNkkyqGl3HePBqlJni-OkOQgF8Wp1t39T5f0/edit?usp=sharing)**

### Setup

**MAKE SURE TO CREATE A CONFIG.JSON FILE THAT LOOKS LIKE THIS IN EACH FOLDER**

```json
{
  "TOKEN": "yourtoken.here",
  "CLIENT_ID": "clientidhere",
  "GUILD_ID": "guildidhere"
}
```

You should be able to just do `npm install` inside of each of the folders to install all of the dependencies.
The list is short:

```shell
$ npm install discord.js
$ npm install --save discord-player # main library
$ npm install --save @discord-player/extractor # extractors provider
$ npm install --save mediaplex
```

You have the option of also include the youtube extractor, which will get your discord bot obliterated if it gets somewhat popular.

```shell
$ npm install --save youtube-ext
```

FFMPEG is also REQUIRED for your bot to be able to stream music.
**[INSTALL IT HERE](https://ffmpeg.org/download.html)**

OR

**Linux (Ubuntu)**

```shell
sudo add-apt-repository ppa:mc3man/trusty-media
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install ffmpeg
ffmpeg
```

**Mac OS**

```shell
brew update
brew upgrade
brew install ffmpeg
ffmpeg
```

**Windows**

```shell
lol install the executable :')
```

That's it, have fun!!!!
