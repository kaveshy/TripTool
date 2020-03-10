using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trips.Models
{
    public class BluetoothDeviceDetails
    {
        public string ID;
        public string Name;
        public BluetoothDeviceConnectionType ConnectionType;
    }
    public enum BluetoothDeviceConnectionType
    {
        Unknown,
        HFP,
        CarAudio,
        A2DP,
        CarAudioOverA2DP,
        HFPOverA2DP,
        CarAudioOverHeadset,
        HFPOverHeadset
    }
}
