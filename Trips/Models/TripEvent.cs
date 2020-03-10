using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{
    public class TripEvent
    {
        public string Locale { get; set; }
        public long Id { get; set; }
        public int? EventSequenceId { get; set; }
        public int EventGroupId { get; set; }
        public DateTimeOffset? InsertedTime { get; set; }
        public DateTimeOffset? EventDateTime { get; set; }
        public DateTimeOffset? GPSDateTime { get; set; }
        public double AccelX { get; set; }
        public double AccelY { get; set; }
        public double AccelZ { get; set; }
        public double MagX { get; set; }
        public double MagY { get; set; }
        public double MagZ { get; set; }
        public double GyroX { get; set; }
        public double GyroY { get; set; }
        public double GyroZ { get; set; }
        public double? Lat { get; set; }
        public double? Lon { get; set; }
        public double? GpsSpeed { get; set; }
        public double? DerivedSpeed { get; set; }
        public double? InterpolatedGpsSpeed { get; set; }
        public double? GpsBearing { get; set; }
        public double? HorizontalAccuracy { get; set; }
        public double? VerticalAccuracy { get; set; }
        public bool? IsPostTripEvent { get; set; }
        public bool? PhoneUsage { get; set; }
        public ScreenUnlockState? CurrentScreenState { get; set; }
        public string CurrentScreenStateDisplay { get => CurrentScreenState?.ToString(); }
        public double? AveragePhoneRotationChange { get; set; }
        public double? MaxPhoneRotationChange { get; set; }
        public double RotationX { get; set; }
        public double RotationY { get; set; }
        public double RotationZ { get; set; }
        public double RotationW { get; set; }
        public long TripId { get; set; }
        public double? BearingDeviation { get; set; }
        public string HarshEvent { get; set; }
        public EventValidity EventValidity { get; set; }
        public string EventValidityDisplay { get => EventValidity.ToString(); }
        public MotionActivity MotionActivity { get; set; }
        public string MotionActivityDisplay { get => MotionActivity.ToString(); }
        public int MotionActivityConfidence { get; set; }
        public int ChanceOfDriving { get; set; }
        public List<QuaternionOrientation> PhoneOrientations { get; set; }
        public MotionActivity MotionType { get; set; }
        public string MotionTypeDisplay { get => MotionType.ToString(); }
        public int? SpeedLimitKm { get; set; }
        public int? OriginalSpeedLimitKm { get; set; }
        public int? CleanedSpeedLimit { get; set; }
        public bool UseCleanedSpeedLimit { get; set; }
        public double? SpeedLimitAccuracyMeters { get; set; }
        public int? SpeedLimitTomTomLineId { get; set; }
        public int BufferSize { get; set; }
        public BluetoothStatus BluetoothConnectionStatus { get; set; }
        public string BluetoothConnectionStatusDisplay { get => BluetoothConnectionStatus.ToString(); }
        public bool KnownLocationEntered { get; set; }
        public string AnalysisTags { get; set; }
        public DateTimeOffset? CorrectedEventTime
        {
            get
            {
                return GPSDateTime.HasValue ? GPSDateTime.Value : EventDateTime;
            }
        }
    }

    public enum MotionActivity
    {
        Unknown,
        Stationary,
        Walking,
        Running,
        Cycling,
        Driving,
        Tilting,
    }
    public enum BluetoothStatus
    {
        None, Paired, Unpaired
    }

    public enum ScreenUnlockState
    {
        unknown,
        lockedWithScreenOn,
        locked,
        unlocked,
    }

    public enum EventValidity
    {
        Valid,
        GPSSpeedInvalid,
        GPSPrecisionLow,
        PostTrip,
        GPSSpeedRepeated,
        InsufficientHorizontalAccuracy,
        InsufficientVerticalAccuracy,
        ChangeInDistanceInsufficient,
        ChangeInDistanceTooLarge,
        GPSDateTimeInvalid,
        DuplicateSequenceId
    }

    public class QuaternionOrientation
    {
        public double X;
        public double Y;
        public double Z;
        public double W;
    }
}
