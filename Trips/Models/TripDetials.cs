using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{
    public class TripDetails
    {
        public string AppTripId { get; set; }
        public int? TripId { get; set; }
        public AppPlatform Platform { get; set; }
        public DateTimeOffset? StartDateTime { get; set; }
        public DateTimeOffset? EndDateTime { get; set; }
        public decimal SampleRateMillis { get; set; }
        public decimal OutputRateMillis { get; set; }
        public DateTimeOffset? InsertedTime { get; set; }
        public double? StartLat { get; set; }
        public double? StartLon { get; set; }
        public string StartLocationDisplay { get; set; }
        public double? DestinationLat { get; set; }
        public double? DestinationLon { get; set; }
        public string DestinationLocationDisplay { get; set; }
        public TripSummary Summary { get; set; }
        public double? Distance { get; set; }
        public double? DriveFactorDistance { get; set; }
        public bool IsPassenger { get; set; }
        public bool? AutoStartedTrip { get; set; }
        public List<TripLog> TripLogs { get; set; }
        public TripEndType TripEndState { get; set; }
        public DateTimeOffset? EventsReceivedAt { get; set; }
        public DateTimeOffset? DriveFactorScoreDate { get; set; }
        public DateTimeOffset? ServerInsertedTime { get; set; }
        // Penalties
        public double? KilometersTraveledPenalty { get; set; }
        public double? HarshBrakesPerKilometerPenalty { get; set; }
        public double? RapidAccelerationsPerKilometerPenalty { get; set; }
        public double? IdleTimeRatioPenalty { get; set; }
        public double? PhoneDisturbancePenalty { get; set; }
        public double? NightRatioPenalty { get; set; }
        public double? SpeedRatioPenalty { get; set; }
        public BluetoothDeviceDetails BluetoothDevice { get; set; }
    }

    public enum AppPlatform
    {
        Unknown, IOS, Android, WhatsApp
    }

    public enum TripEndType
    {
        Unknown = 0,
        AutoStop = 1,
        ManualStop = 2,
        GPSTurnedOff = 3,
        Recovered = 4,
    }
}
