using System;
using System.Collections.Generic;
using System.Text;
using TwitchLib.Client;
using TwitchLib.Client.Enums;
using TwitchLib.Client.Events;
using TwitchLib.Client.Extensions;
using TwitchLib.Client.Models;

namespace PHoCStreamBot
{
    public class TwitchBot
    {
        TwitchBotSettings settings;

        public TwitchBot(TwitchBotSettings settings)
        {
            this.settings = settings;
            Client = new TwitchClient();
        }
        
        public TwitchClient Client { get; private set; }
        public string UserName => settings.UserName;

        public void Initialize()
        {
            var credentials = new ConnectionCredentials(settings.UserName, settings.Token);
            Client.Initialize(credentials, settings.Channel);

            Client.OnLog += Client_OnLog;
            Client.OnJoinedChannel += Client_OnJoinedChannel;
            Client.OnConnected += Client_OnConnected;
            Client.Connect();
        }

        public void SendMessage(string message)
        {
            Client.SendMessage(settings.Channel, message);
        }

        private void Client_OnLog(object sender, OnLogArgs e)
        {
            Console.WriteLine($"{e.DateTime.ToString()}: {e.BotUsername} - {e.Data}");
        }

        private void Client_OnConnected(object sender, OnConnectedArgs e)
        {
            Console.WriteLine($"Connected to {e.AutoJoinChannel}");
        }

        private void Client_OnJoinedChannel(object sender, OnJoinedChannelArgs e)
        {
            Client.SendMessage(e.Channel, "Hey All!  I am here to help.  And hopefully make it more fun.  Try !bot to find out what I can do.");
        }
    }
}
