using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{

    public class HarshEvent
    {
        public HarshEventType Type { get; set; }
        public string Heading { get; set; }
        public string Description { get; set; }
        public string Polyline { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTimeOffset EventDateTime { get; set; }
    }

    public enum HarshEventType
    {
        Unknown,
        HarshSpeed,
        HarshAcceleration,
        HarshBrake,
        HarshTurnLeft,
        PhoneUsage,
        HarshTurnRight,
    }
}
