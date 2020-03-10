using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{
    public class TripSummary 
    {
        public double? Score { get; set; }
        public double? TrueScore { get; set; }
        public int? StarScore { get; set; }
        public bool ValidForPayback { get; set; }
        public string ValidityReason { get; set; }
        public double? Turns { get; set; }
        public double? HardBrake { get; set; }
        public double? Acceleration { get; set; }
        public double? Speed { get; set; }
        public int? NumberOfTurnEvents { get; set; }
        public int? NumberOfBrakeEvents { get; set; }
        public int? NumberOfAccelerationEvents { get; set; }
        public int? NumberOfSpeedEvents { get; set; }
        // new factors hardcoded for now
        public double? PercentageTimeSpeeding { get; set; }
        public double? PercentageTimeHighRisk { get; set; }
        public double? PercentageTimeNightDriving { get; set; }
        public double? PhoneRotationsPerSecond { get; set; }
        public string PhoneRotationsPerSecondBand { get; set; }
        public bool EnablePhoneRotationScoring { get; set; }
        public double? HarshBrakesPerKilometer { get; set; }
        public double? HarshAccelerationsPerKilometer { get; set; }
        public double? DriveFactorDistance { get; set; }
        public string RouteRiskDisplay
        {
            get
            {
                if (!PercentageTimeHighRisk.HasValue) return "Unknown";
                if (PercentageTimeHighRisk.Value <= 0.10) return "Low";
                if (PercentageTimeHighRisk.Value <= 0.25) return "Medium";
                if (PercentageTimeHighRisk.Value <= 0.35) return "High";
                if (PercentageTimeHighRisk.Value <= 0.50) return "Very High";
                return "Extreme";
            }
        }
        public double? PercentageTimeUsingCellphone
        {
            get { return PhoneRotationsPerSecond; }
        }
        public string PhoneDisturbanceDisplay
        {
            get { return PhoneRotationsPerSecondBand; }
        }
        public ICollection<HarshEvent> HarshEvents { get; set; }
        // Penalties
        //public ScoreFactorPenaltyDetails KilometersTraveledPenalty { get; set; }
        public ScoreFactorPenaltyDetails HarshBrakesPerKilometerPenaltyDetails { get; set; }
        public ScoreFactorPenaltyDetails RapidAccelerationsPerKilometerPenaltyDetials { get; set; }
        //public ScoreFactorPenaltyDetails IdleTimeRatioPenalty { get; set; }
        public ScoreFactorPenaltyDetails PhoneDisturbancePenaltyDetails { get; set; }
        public ScoreFactorPenaltyDetails NightRatioPenaltyDetails { get; set; }
        public ScoreFactorPenaltyDetails SpeedRatioPenaltyDetails { get; set; }
    }
    public class ScoreFactorPenaltyDetails
    {
        public string Title { get; set; }
        public double? Penalty { get; set; }
        public ScoreFactorPenaltyDetails(double? penalty, string partilaTitle)
        {
            Penalty = penalty;
            Title = $"{GetBandName(penalty)} {partilaTitle}";
        }
        public ScoreFactorPenaltyDetails()
        { }
        public double? PenaltyDisplayPercent
        {
            get
            {
                if (!Penalty.HasValue)
                    return null;
                var percent = Penalty.Value / 100;
                percent = Math.Min(percent, 1);
                percent = Math.Max(percent, 0);
                return percent;
            }
        }
        string GetBandName(double? penalty)
        {
            if (penalty == null || penalty == 0)
                return "No";
            if (penalty < 30)
                return "Low";
            if (penalty < 60)
                return "Medium";
            return "High";
        }
    }
}
