using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using PHoCStreamBot.Web.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TwitchLib.Client.Events;

namespace PHoCStreamBot.Web
{
    public class TwitchBackgroundWorker : IHostedService
    {
        readonly TwitchBot bot;
        readonly IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub;
        readonly List<string> excludedUsers = new List<string>() { "streamlabs" };
        readonly IReadOnlyList<BotCommandDefinition> commandDefs;
        readonly IReadOnlyList<IChatMessageHandler> chatMessageHandlers;

        public TwitchBackgroundWorker(
            TwitchBot bot,
            IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub)
        {
            this.hub = hub;
            this.bot = bot;
            excludedUsers.Add(bot.UserName);
            commandDefs = new CommandBuilder(hub, bot).Build();
            chatMessageHandlers = new List<IChatMessageHandler>
            {
                new ToastMessageChatMessageHandler(hub)
            };
        }

        public void HookEvents()
        {
            bot.Client.OnMessageReceived += Client_OnMessageReceived;
            bot.Client.OnChatCommandReceived += Client_OnChatCommandReceived;
            bot.Client.OnDisconnected += Client_OnDisconnected;
            bot.Client.OnJoinedChannel += Client_OnJoinedChannel;
        }

        private void Client_OnJoinedChannel(object sender, OnJoinedChannelArgs e)
        {

        }

        private void Client_OnDisconnected(object sender, TwitchLib.Communication.Events.OnDisconnectedEventArgs e)
        {
            Console.WriteLine("******** BOT DISCONNECTED!!! **********");
        }

        private void Client_OnChatCommandReceived(object sender, TwitchLib.Client.Events.OnChatCommandReceivedArgs e)
        {
            var command = new BotCommand(
                e.Command.CommandText,
                e.Command.ArgumentsAsList,
                e.Command.ChatMessage.Username,
                e.Command.ChatMessage.ColorHex);
            var def = commandDefs.FirstOrDefault(x => x.CommandText == command.CommandText);
            if (def != null)
            {
                def.Handler.Handle(command);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            bot.Initialize();
            HookEvents();
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

            foreach (var handler in chatMessageHandlers)
            {
                handler.Handle(new ChatMessage
                {
                    UserName = e.ChatMessage.Username,
                    DisplayName = e.ChatMessage.DisplayName,
                    Text = e.ChatMessage.Message,
                    UserNameColor = e.ChatMessage.ColorHex,
                    Emotes = e.ChatMessage.EmoteSet.Emotes
                });
            }
        }
    }

    public interface IChatMessageHandler
    {
        void Handle(ChatMessage message);
    }

    public class ToastMessageChatMessageHandler : IChatMessageHandler
    {
        IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub;
        public ToastMessageChatMessageHandler(IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub)
        {
            this.hub = hub;
        }

        public void Handle(ChatMessage message)
        {
            hub.Clients.All.ReceiveMessage(message);
        }
    }

    public class CommandBuilder
    {
        readonly IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub;
        readonly TwitchBot bot;

        public CommandBuilder(
            IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub,
            TwitchBot bot)
        {
            this.bot = bot;
            this.hub = hub;
        }

        public IReadOnlyList<BotCommandDefinition> Build()
        {
            return new List<BotCommandDefinition>
            {
                new BotCommandDefinition("hi_pete", new SignalRBotCommandHandler(hub)),
                new BotCommandDefinition("yell", new SignalRBotCommandHandler(hub)),
                new BotCommandDefinition("alien", new SignalRBotCommandHandler(hub)),
                new BotCommandDefinition("bot", new ChatResponseBotCommandHandler(
                    bot,
                    "Type !hi_pete to let him know you are watching. !info to get Pete's House of Code details.")),
                new BotCommandDefinition("info", new ChatResponseBotCommandHandler(
                    bot,
                    "Visit us as https://www.peteshouseofcode.com"))
            };
        }
    }

    public class BotCommandDefinition
    {
        public string CommandText { get; }
        public IBotCommandHandler Handler { get; }

        public BotCommandDefinition(string commandText, IBotCommandHandler handler)
        {
            CommandText = commandText;
            Handler = handler;
        }
    }

    public interface IBotCommandHandler
    {
        void Handle(BotCommand command);
    }

    public class ChatResponseBotCommandHandler : IBotCommandHandler
    {
        readonly TwitchBot bot;
        readonly string message;

        public ChatResponseBotCommandHandler(TwitchBot bot, string message)
        {
            this.message = message;
            this.bot = bot;
        }
        public void Handle(BotCommand command)
        {
            bot.SendMessage(message);
        }
    }

    public class SignalRBotCommandHandler : IBotCommandHandler
    {
        readonly IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub;

        public SignalRBotCommandHandler(IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub)
        {
            this.hub = hub;
        }

        public void Handle(BotCommand command)
        {
            hub.Clients.All.ExecuteCommand(command);
        }
    }

    public class CommandUser
    {
        public string Username { get; set; }
        public string HexColor { get; set; }
    }

    public class BotCommand
    {
        public string CommandText { get; }
        public List<string> Args { get; }

        public CommandUser User { get; }

        public BotCommand(
            string commandText,
            List<string> args,
            string Username,
            string hexColor)
        {
            CommandText = commandText;
            Args = args;
            User = new CommandUser
            {
                Username = Username,
                HexColor = hexColor
            };
        }
    }
}
