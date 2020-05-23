using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PHoCStreamBot.Web.Hubs;

namespace PHoCStreamBot.Web.Controllers
{
    public class StreamController : Controller
    {
        private readonly IReadOnlyList<BotCommandDefinition> commandDefs;
        private readonly List<IChatMessageHandler> chatMessageHandlers;

        public StreamController(
            TwitchBot bot,
            IHubContext<PHoCStreamBotHub, IPHoCStreamBotHub> hub)
        {
            commandDefs = new CommandBuilder(hub, bot).Build();
            chatMessageHandlers = new List<IChatMessageHandler>
            {
                new ToastMessageChatMessageHandler(hub)
            };            
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Canvas()
        {
            return View();
        }

        public IActionResult Phaser()
        {
            return View();
        }

        public IActionResult Commands()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Commands(SendCommandModel model)
        {
            if(!ModelState.IsValid)
            {
                return View();
            }

            // var command = new BotCommand(model.CommandName, SplitAndTrim(model.Args));
            // var def = commandDefs.FirstOrDefault(x => x.CommandText == command.CommandText);
            // if (def == null)
            // {
            //     return BadRequest();
            // }

            // def.Handler.Handle(command);
            return View(model);
        }

        private static List<string> SplitAndTrim(string args)
        {
            if(args == null)
            {
                return new List<string>();
            }

            return args
                .Split(",", System.StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .ToList();
        }
    }

    public class SendCommandModel
    {
        public string CommandName {get;set;}
        public string Args { get; set; }
    }
}