using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Trips.Models;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace Trips.Controllers
{
    
    [Authorize]
    public class TripsController : Controller
    {
        
        private static string baseURL = "https://drivewithdialstable.retrotest.co.za";
        private static string eventsRoute = "/api/v1/trip/get/processedevents/from/s3/for/";
        private static string detailsRoute = "/api/v1/trip/get/by/id/";
        private static string ApiKey = "Bearer BvH34xVsIfFEXceY34Rv_j4x-QMvJQpbSVfml1GOi8N3KD8tTqEFQIsIJcM-Pq7w106UD--A3oORC2Vy4p_p-NUsCQ7vYTskttr0VyBZDri-xetBfAqDlEq6jk2cePQceNkceGyLiEo423vK4VgprZd63dIxMj20a4tOJHN9uX1_2wwONcpzWobmaCbdKgYRYPj00Fl0zWbmG3uGCiO0Xyz4fzwTWB8EYn6kUp5n0C2ugzJUOtS3SwUrByPiEpnfmtoBNa6nlEi5qu4FTTsAP4yXK_d9-j3LeEvGGR3wYpdwM_A_lA0haXSTWe7b_0Qjn2E8Fh2uyih_y5uuYpxBwvleuJfcjxr26Xr4_HFeZfxJRwLO8o3wcrk-mOUbAIynzRHjxbL_o9LhqRstZBDNx4vY9QC303387vg_evmdyUbwyfJsEPCcWfMwu94vxwBN-nSuNfrQqAcRo10l5TqBEI2Gg0I-DEapci5MwoZ6LlK092nABXI_ZqdGEjLmQapx";
        private static string baseURLProd = "https://driveapi.dialdirect.co.za";
        private static string apiTokenProd = "Bearer 7dYmVG-Yv007QssMkTsuSDEv98fWfSB-62sbcfpc77lQNXhIBqvIO1A3-o479-G52ibrv9lD6dzABs7ihUxGilR0nsc0o2DJLaP4K58ujhpCMUBmPzT5bJCtTCExgowBe7aFT7kCzhLWeVsIZgdGn6mcr25r-fid2skrVvSqvhNXVwHaffUT-20oRKBeFhio-wnUuUf2hSoqtW8jdaccrRIzSsFYxHcCWWdpPxleffnTsLloX4gZrsPuZAWysAe7AESWulCAgkv1GOJ3Zd4jqEA5S4C9TOsdfNkWipoJXEfU7Tb9GlXxRvLJwNX53L6oi0QlWo-F_67ICgCsS7lfgk_CcTY1uvlGJvLPSObvDiAXDGuknNn1EHa2OjmAil-2Bop-JT4s8xrorhSIr4XbEHpIN48acGZqEuVc4mWW4GrL-467jjX5Jj3qdExHku1UBA1Q40o4JR_dAWPGxrzIuwggsh8xad4QwmpGIhzYshBtswisoRp72Pn6Ve1gOtDm";

        [Authorize]
        public IActionResult Trips()
        {
            return View();
        }

        [HttpGet("get/tripevents/prod/{TripId}")]
        public async Task<string> GetTripEventsProdAsync(int TripId)
        {

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(baseURLProd);
            client.DefaultRequestHeaders.Add("Authorization", apiTokenProd);

            HttpResponseMessage response = await client.GetAsync(baseURLProd + eventsRoute + TripId);
            try
            {
                if (response.IsSuccessStatusCode)
                {

                    var temp = await response.Content.ReadAsAsync<object>();
                    return temp.ToString();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return e.ToString()+"call error local controller";
            }

            return "error in GetFromProd Function";
        }

        [HttpGet("get/tripdetails/prod/{TripId}")]
        public async Task<string> GetTripDetailsProdAsync(int TripId)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(baseURLProd);
            client.DefaultRequestHeaders.Add("Authorization", apiTokenProd);

            HttpResponseMessage response = await client.GetAsync(baseURLProd + detailsRoute + TripId);
            try
            {
                if (response.IsSuccessStatusCode)
                {

                    var temp = await response.Content.ReadAsAsync<object>();
                    return temp.ToString();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return e.ToString();
            }

            return "error in GetFromProd Function";
        }

        //public async Task<string> GetFromProd(string Route, int TripId)
        //{
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new Uri(baseURLProd);
        //    client.DefaultRequestHeaders.Add("Authorization", apiTokenProd);

        //    HttpResponseMessage response = await client.GetAsync(baseURLProd + Route + TripId);
        //    try
        //    {
        //        if (response.IsSuccessStatusCode)
        //        {

        //            var temp = await response.Content.ReadAsAsync<object>();
        //            return temp.ToString();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e);
        //        return e.ToString();
        //    }

        //    return "error in GetFromProd Function";
        //}

    }
}