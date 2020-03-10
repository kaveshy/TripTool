using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{
    public class TripLog
    {
        public DateTimeOffset? TimeStamp { get; set; }
        public string Message { get; set; }
    }
}
