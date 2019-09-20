using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PHoCStreamBot.Web.Controllers
{
    public class StreamController : Controller
    {
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
    }
}