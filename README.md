# Hîsyêô Discord Bot

This project contains a bot for Hisyëö servers. It can:

- translate latin script into Hisyëö writing systems
- locate and present details about specific Hisyëö words
- search, vote and propose kennings.

Read the **[Hîsyêô documentation](https://hisyeo.github.io/docs/intro)** for lessons and reference materials about this world language.

## Prerequisites

To get best use out of this project you'll ideally be familiar with JavaScript and have a little Node.js experience–check out [Hello Node](https://glitch.com/~glitch-hello-node) if you haven't already!

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool bot does and how you built it.

← `package.json`: The NPM packages for your project's dependencies.

← `.env`: The environment is cleared when you initially remix the project, but you will add a new env variable value when you set up an admin key.

← `app.js` contains the express server

← `commands.js` contains the functions for each command

← `middleware.js` contains the express logger

← `register.js` is a script to register the api with Discord

← `utils.js` is where all the real work happens

## Deploying to YunoHost

This application is designed to be deployed on a YunoHost server using the `my_webapp` package.

### Installation

1.  Install the `my_webapp` package on your YunoHost server.
2.  Connect to your server via SSH.
3.  Clone this repository: `git clone https://github.com/JakeRusso/Hisyeo-Abugida-Bot.git`
4.  Navigate to the cloned directory: `cd Hisyeo-Abugida-Bot`
5.  Run the YunoHost installation command:

    ```bash
    sudo yunohost app install my_webapp --args "domain=your_domain.tld&path=/bot&user=hisyeo-bot&app_name=hisyeo-abugida-bot&app_repo=https://github.com/JakeRusso/Hisyeo-Abugida-Bot.git&app_branch=main&app_launch_command=npm start&app_port=3000&is_public=true"
    ```

    Replace `your_domain.tld` with your actual domain.

### Configuration

The application requires the following environment variables to be set in the `.env` file:

*   `PUBLIC_KEY`: Your Discord application's public key.
*   `APP_ID`: Your Discord application's ID.
*   `TOKEN`: Your Discord bot's token.

You can set these variables using the following command:

```bash
sudo yunohost app shell hisyeo-abugida-bot --script "echo 'PUBLIC_KEY=your_public_key' > .env"
sudo yunohost app shell hisyeo-abugida-bot --script "echo 'APP_ID=your_app_id' >> .env"
sudo yunohost app shell hisyeo-abugida-bot --script "echo 'TOKEN=your_token' >> .env"
```

Replace `your_public_key`, `your_app_id`, and `your_token` with your actual credentials.

### Starting the Application

The application should start automatically after installation. If you need to start it manually, you can use the following command:

```bash
sudo yunohost app service hisyeo-abugida-bot start
```