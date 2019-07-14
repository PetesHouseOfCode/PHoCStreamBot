using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using PHoCStreamBot.Web.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PHoCStreamBot.Web
{
    public class TwitchBackgroundWorker : IHostedService
    {
        readonly TwitchBot bot;
        readonly IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub;

        public TwitchBackgroundWorker(
            TwitchBot bot,
            IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub)
        {
            this.hub = hub;
            this.bot = bot;
        }

        public void HookEvents()
        {
            bot.Client.OnMessageReceived += Client_OnMessageReceived;
            bot.Client.OnChatCommandReceived += Client_OnChatCommandReceived;
        }

        private void Client_OnChatCommandReceived(object sender, TwitchLib.Client.Events.OnChatCommandReceivedArgs e)
        {
            hub.Clients.All.ExecuteCommand("CMD:" + e.Command.CommandText, e.Command.ArgumentsAsString);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            HookEvents();
            bot.Initialize();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return null;
        }

        private void Client_OnMessageReceived(object sender, TwitchLib.Client.Events.OnMessageReceivedArgs e)
        {
            if (e.ChatMessage.Message.StartsWith("!"))
                return;

            hub.Clients.All.ReceiveMessage(new ChatMessage
            {
                UserName = e.ChatMessage.Username,
                DisplayName = e.ChatMessage.DisplayName,
                Text = e.ChatMessage.Message,
                UserNameColor = e.ChatMessage.ColorHex
            });
        }
    }
}
