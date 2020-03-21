using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitchLib.Client.Models;

namespace PHoCStreamBot.Web.Hubs
{
    public class PHoCStreamBotHub : Hub<IPHoCStreamBotHub>
    {
        public void SendCommand(string command, string args)
        {
            Clients.All.ExecuteCommand(command, args);
        }

        public PHoCStreamBotHub()
        {
        }
    }

    public interface IPHoCStreamBotHub
    {
        Task ExecuteCommand(string command, string args);
        Task ReceiveMessage(ChatMessage message);
    }

    public class ChatMessage
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Text { get; set; }
        public string UserNameColor { get; set; }
        public List<Emote> Emotes {get;set;} = new List<Emote>();
    }
}
