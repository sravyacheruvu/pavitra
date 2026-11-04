/** Bundled, offline city directory for location selection (works with no network). */
export type City = {
  city: string; region: string; country: string;
  latitude: number; longitude: number; timeZone: string;
};

export const CITIES: City[] = [
  {
    "city": "Hyderabad",
    "region": "Telangana",
    "country": "India",
    "latitude": 17.385,
    "longitude": 78.4867,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Bengaluru",
    "region": "Karnataka",
    "country": "India",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Chennai",
    "region": "Tamil Nadu",
    "country": "India",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Vijayawada",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 16.5062,
    "longitude": 80.648,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Visakhapatnam",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 17.6868,
    "longitude": 83.2185,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Guntur",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 16.3067,
    "longitude": 80.4365,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Tirupati",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 13.6288,
    "longitude": 79.4192,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Nellore",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 14.4426,
    "longitude": 79.9865,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Rajahmundry",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 16.9891,
    "longitude": 81.7838,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Kakinada",
    "region": "Andhra Pradesh",
    "country": "India",
    "latitude": 16.9891,
    "longitude": 82.2475,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Warangal",
    "region": "Telangana",
    "country": "India",
    "latitude": 17.9689,
    "longitude": 79.5941,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Karimnagar",
    "region": "Telangana",
    "country": "India",
    "latitude": 18.4386,
    "longitude": 79.1288,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Coimbatore",
    "region": "Tamil Nadu",
    "country": "India",
    "latitude": 11.0168,
    "longitude": 76.9558,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Madurai",
    "region": "Tamil Nadu",
    "country": "India",
    "latitude": 9.9252,
    "longitude": 78.1198,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Tiruchirappalli",
    "region": "Tamil Nadu",
    "country": "India",
    "latitude": 10.7905,
    "longitude": 78.7047,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Kochi",
    "region": "Kerala",
    "country": "India",
    "latitude": 9.9312,
    "longitude": 76.2673,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Thiruvananthapuram",
    "region": "Kerala",
    "country": "India",
    "latitude": 8.5241,
    "longitude": 76.9366,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Kozhikode",
    "region": "Kerala",
    "country": "India",
    "latitude": 11.2588,
    "longitude": 75.7804,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Mysuru",
    "region": "Karnataka",
    "country": "India",
    "latitude": 12.2958,
    "longitude": 76.6394,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Mangaluru",
    "region": "Karnataka",
    "country": "India",
    "latitude": 12.9141,
    "longitude": 74.856,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Hubballi",
    "region": "Karnataka",
    "country": "India",
    "latitude": 15.3647,
    "longitude": 75.124,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Mumbai",
    "region": "Maharashtra",
    "country": "India",
    "latitude": 19.076,
    "longitude": 72.8777,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Pune",
    "region": "Maharashtra",
    "country": "India",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Nagpur",
    "region": "Maharashtra",
    "country": "India",
    "latitude": 21.1458,
    "longitude": 79.0882,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "New Delhi",
    "region": "Delhi",
    "country": "India",
    "latitude": 28.6139,
    "longitude": 77.209,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Gurugram",
    "region": "Haryana",
    "country": "India",
    "latitude": 28.4595,
    "longitude": 77.0266,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Noida",
    "region": "Uttar Pradesh",
    "country": "India",
    "latitude": 28.5355,
    "longitude": 77.391,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Kolkata",
    "region": "West Bengal",
    "country": "India",
    "latitude": 22.5726,
    "longitude": 88.3639,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Ahmedabad",
    "region": "Gujarat",
    "country": "India",
    "latitude": 23.0225,
    "longitude": 72.5714,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Surat",
    "region": "Gujarat",
    "country": "India",
    "latitude": 21.1702,
    "longitude": 72.8311,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Jaipur",
    "region": "Rajasthan",
    "country": "India",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Lucknow",
    "region": "Uttar Pradesh",
    "country": "India",
    "latitude": 26.8467,
    "longitude": 80.9462,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Kanpur",
    "region": "Uttar Pradesh",
    "country": "India",
    "latitude": 26.4499,
    "longitude": 80.3319,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Varanasi",
    "region": "Uttar Pradesh",
    "country": "India",
    "latitude": 25.3176,
    "longitude": 82.9739,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Bhopal",
    "region": "Madhya Pradesh",
    "country": "India",
    "latitude": 23.2599,
    "longitude": 77.4126,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Indore",
    "region": "Madhya Pradesh",
    "country": "India",
    "latitude": 22.7196,
    "longitude": 75.8577,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Patna",
    "region": "Bihar",
    "country": "India",
    "latitude": 25.5941,
    "longitude": 85.1376,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Bhubaneswar",
    "region": "Odisha",
    "country": "India",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Chandigarh",
    "region": "Chandigarh",
    "country": "India",
    "latitude": 30.7333,
    "longitude": 76.7794,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Amritsar",
    "region": "Punjab",
    "country": "India",
    "latitude": 31.634,
    "longitude": 74.8723,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "Guwahati",
    "region": "Assam",
    "country": "India",
    "latitude": 26.1445,
    "longitude": 91.7362,
    "timeZone": "Asia/Kolkata"
  },
  {
    "city": "New York",
    "region": "New York",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.006,
    "timeZone": "America/New_York"
  },
  {
    "city": "Edison",
    "region": "New Jersey",
    "country": "USA",
    "latitude": 40.5187,
    "longitude": -74.4121,
    "timeZone": "America/New_York"
  },
  {
    "city": "Jersey City",
    "region": "New Jersey",
    "country": "USA",
    "latitude": 40.7178,
    "longitude": -74.0431,
    "timeZone": "America/New_York"
  },
  {
    "city": "Boston",
    "region": "Massachusetts",
    "country": "USA",
    "latitude": 42.3601,
    "longitude": -71.0589,
    "timeZone": "America/New_York"
  },
  {
    "city": "Philadelphia",
    "region": "Pennsylvania",
    "country": "USA",
    "latitude": 39.9526,
    "longitude": -75.1652,
    "timeZone": "America/New_York"
  },
  {
    "city": "Washington",
    "region": "DC",
    "country": "USA",
    "latitude": 38.9072,
    "longitude": -77.0369,
    "timeZone": "America/New_York"
  },
  {
    "city": "Baltimore",
    "region": "Maryland",
    "country": "USA",
    "latitude": 39.2904,
    "longitude": -76.6122,
    "timeZone": "America/New_York"
  },
  {
    "city": "Ashburn",
    "region": "Virginia",
    "country": "USA",
    "latitude": 39.0438,
    "longitude": -77.4874,
    "timeZone": "America/New_York"
  },
  {
    "city": "Atlanta",
    "region": "Georgia",
    "country": "USA",
    "latitude": 33.749,
    "longitude": -84.388,
    "timeZone": "America/New_York"
  },
  {
    "city": "Raleigh",
    "region": "North Carolina",
    "country": "USA",
    "latitude": 35.7796,
    "longitude": -78.6382,
    "timeZone": "America/New_York"
  },
  {
    "city": "Charlotte",
    "region": "North Carolina",
    "country": "USA",
    "latitude": 35.2271,
    "longitude": -80.8431,
    "timeZone": "America/New_York"
  },
  {
    "city": "Orlando",
    "region": "Florida",
    "country": "USA",
    "latitude": 28.5383,
    "longitude": -81.3792,
    "timeZone": "America/New_York"
  },
  {
    "city": "Miami",
    "region": "Florida",
    "country": "USA",
    "latitude": 25.7617,
    "longitude": -80.1918,
    "timeZone": "America/New_York"
  },
  {
    "city": "Pittsburgh",
    "region": "Pennsylvania",
    "country": "USA",
    "latitude": 40.4406,
    "longitude": -79.9959,
    "timeZone": "America/New_York"
  },
  {
    "city": "Detroit",
    "region": "Michigan",
    "country": "USA",
    "latitude": 42.3314,
    "longitude": -83.0458,
    "timeZone": "America/Detroit"
  },
  {
    "city": "Columbus",
    "region": "Ohio",
    "country": "USA",
    "latitude": 39.9612,
    "longitude": -82.9988,
    "timeZone": "America/New_York"
  },
  {
    "city": "Chicago",
    "region": "Illinois",
    "country": "USA",
    "latitude": 41.8781,
    "longitude": -87.6298,
    "timeZone": "America/Chicago"
  },
  {
    "city": "Dallas",
    "region": "Texas",
    "country": "USA",
    "latitude": 32.7767,
    "longitude": -96.797,
    "timeZone": "America/Chicago"
  },
  {
    "city": "Houston",
    "region": "Texas",
    "country": "USA",
    "latitude": 29.7604,
    "longitude": -95.3698,
    "timeZone": "America/Chicago"
  },
  {
    "city": "Austin",
    "region": "Texas",
    "country": "USA",
    "latitude": 30.2672,
    "longitude": -97.7431,
    "timeZone": "America/Chicago"
  },
  {
    "city": "Minneapolis",
    "region": "Minnesota",
    "country": "USA",
    "latitude": 44.9778,
    "longitude": -93.265,
    "timeZone": "America/Chicago"
  },
  {
    "city": "Denver",
    "region": "Colorado",
    "country": "USA",
    "latitude": 39.7392,
    "longitude": -104.9903,
    "timeZone": "America/Denver"
  },
  {
    "city": "Phoenix",
    "region": "Arizona",
    "country": "USA",
    "latitude": 33.4484,
    "longitude": -112.074,
    "timeZone": "America/Phoenix"
  },
  {
    "city": "Seattle",
    "region": "Washington",
    "country": "USA",
    "latitude": 47.6062,
    "longitude": -122.3321,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "San Francisco",
    "region": "California",
    "country": "USA",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "San Jose",
    "region": "California",
    "country": "USA",
    "latitude": 37.3382,
    "longitude": -121.8863,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "Fremont",
    "region": "California",
    "country": "USA",
    "latitude": 37.5485,
    "longitude": -121.9886,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "Los Angeles",
    "region": "California",
    "country": "USA",
    "latitude": 34.0522,
    "longitude": -118.2437,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "San Diego",
    "region": "California",
    "country": "USA",
    "latitude": 32.7157,
    "longitude": -117.1611,
    "timeZone": "America/Los_Angeles"
  },
  {
    "city": "Toronto",
    "region": "Ontario",
    "country": "Canada",
    "latitude": 43.6532,
    "longitude": -79.3832,
    "timeZone": "America/Toronto"
  },
  {
    "city": "Mississauga",
    "region": "Ontario",
    "country": "Canada",
    "latitude": 43.589,
    "longitude": -79.6441,
    "timeZone": "America/Toronto"
  },
  {
    "city": "Ottawa",
    "region": "Ontario",
    "country": "Canada",
    "latitude": 45.4215,
    "longitude": -75.6972,
    "timeZone": "America/Toronto"
  },
  {
    "city": "Montreal",
    "region": "Quebec",
    "country": "Canada",
    "latitude": 45.5019,
    "longitude": -73.5674,
    "timeZone": "America/Toronto"
  },
  {
    "city": "Calgary",
    "region": "Alberta",
    "country": "Canada",
    "latitude": 51.0447,
    "longitude": -114.0719,
    "timeZone": "America/Edmonton"
  },
  {
    "city": "Vancouver",
    "region": "British Columbia",
    "country": "Canada",
    "latitude": 49.2827,
    "longitude": -123.1207,
    "timeZone": "America/Vancouver"
  },
  {
    "city": "London",
    "region": "England",
    "country": "UK",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "timeZone": "Europe/London"
  },
  {
    "city": "Birmingham",
    "region": "England",
    "country": "UK",
    "latitude": 52.4862,
    "longitude": -1.8904,
    "timeZone": "Europe/London"
  },
  {
    "city": "Leicester",
    "region": "England",
    "country": "UK",
    "latitude": 52.6369,
    "longitude": -1.1398,
    "timeZone": "Europe/London"
  },
  {
    "city": "Manchester",
    "region": "England",
    "country": "UK",
    "latitude": 53.4808,
    "longitude": -2.2426,
    "timeZone": "Europe/London"
  },
  {
    "city": "Edinburgh",
    "region": "Scotland",
    "country": "UK",
    "latitude": 55.9533,
    "longitude": -3.1883,
    "timeZone": "Europe/London"
  },
  {
    "city": "Dublin",
    "region": "Leinster",
    "country": "Ireland",
    "latitude": 53.3498,
    "longitude": -6.2603,
    "timeZone": "Europe/Dublin"
  },
  {
    "city": "Frankfurt",
    "region": "Hesse",
    "country": "Germany",
    "latitude": 50.1109,
    "longitude": 8.6821,
    "timeZone": "Europe/Berlin"
  },
  {
    "city": "Zurich",
    "region": "Zurich",
    "country": "Switzerland",
    "latitude": 47.3769,
    "longitude": 8.5417,
    "timeZone": "Europe/Zurich"
  },
  {
    "city": "Amsterdam",
    "region": "North Holland",
    "country": "Netherlands",
    "latitude": 52.3676,
    "longitude": 4.9041,
    "timeZone": "Europe/Amsterdam"
  },
  {
    "city": "Paris",
    "region": "Île-de-France",
    "country": "France",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "timeZone": "Europe/Paris"
  },
  {
    "city": "Dubai",
    "region": "Dubai",
    "country": "UAE",
    "latitude": 25.2048,
    "longitude": 55.2708,
    "timeZone": "Asia/Dubai"
  },
  {
    "city": "Abu Dhabi",
    "region": "Abu Dhabi",
    "country": "UAE",
    "latitude": 24.4539,
    "longitude": 54.3773,
    "timeZone": "Asia/Dubai"
  },
  {
    "city": "Sharjah",
    "region": "Sharjah",
    "country": "UAE",
    "latitude": 25.3463,
    "longitude": 55.4209,
    "timeZone": "Asia/Dubai"
  },
  {
    "city": "Doha",
    "region": "Doha",
    "country": "Qatar",
    "latitude": 25.2854,
    "longitude": 51.531,
    "timeZone": "Asia/Qatar"
  },
  {
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "latitude": 24.7136,
    "longitude": 46.6753,
    "timeZone": "Asia/Riyadh"
  },
  {
    "city": "Jeddah",
    "region": "Makkah",
    "country": "Saudi Arabia",
    "latitude": 21.4858,
    "longitude": 39.1925,
    "timeZone": "Asia/Riyadh"
  },
  {
    "city": "Kuwait City",
    "region": "Al Asimah",
    "country": "Kuwait",
    "latitude": 29.3759,
    "longitude": 47.9774,
    "timeZone": "Asia/Kuwait"
  },
  {
    "city": "Muscat",
    "region": "Muscat",
    "country": "Oman",
    "latitude": 23.588,
    "longitude": 58.3829,
    "timeZone": "Asia/Muscat"
  },
  {
    "city": "Manama",
    "region": "Capital",
    "country": "Bahrain",
    "latitude": 26.2285,
    "longitude": 50.586,
    "timeZone": "Asia/Bahrain"
  },
  {
    "city": "Singapore",
    "region": "",
    "country": "Singapore",
    "latitude": 1.3521,
    "longitude": 103.8198,
    "timeZone": "Asia/Singapore"
  },
  {
    "city": "Kuala Lumpur",
    "region": "",
    "country": "Malaysia",
    "latitude": 3.139,
    "longitude": 101.6869,
    "timeZone": "Asia/Kuala_Lumpur"
  },
  {
    "city": "Hong Kong",
    "region": "",
    "country": "Hong Kong",
    "latitude": 22.3193,
    "longitude": 114.1694,
    "timeZone": "Asia/Hong_Kong"
  },
  {
    "city": "Tokyo",
    "region": "",
    "country": "Japan",
    "latitude": 35.6762,
    "longitude": 139.6503,
    "timeZone": "Asia/Tokyo"
  },
  {
    "city": "Colombo",
    "region": "Western",
    "country": "Sri Lanka",
    "latitude": 6.9271,
    "longitude": 79.8612,
    "timeZone": "Asia/Colombo"
  },
  {
    "city": "Kathmandu",
    "region": "Bagmati",
    "country": "Nepal",
    "latitude": 27.7172,
    "longitude": 85.324,
    "timeZone": "Asia/Kathmandu"
  },
  {
    "city": "Sydney",
    "region": "NSW",
    "country": "Australia",
    "latitude": -33.8688,
    "longitude": 151.2093,
    "timeZone": "Australia/Sydney"
  },
  {
    "city": "Melbourne",
    "region": "Victoria",
    "country": "Australia",
    "latitude": -37.8136,
    "longitude": 144.9631,
    "timeZone": "Australia/Melbourne"
  },
  {
    "city": "Brisbane",
    "region": "Queensland",
    "country": "Australia",
    "latitude": -27.4698,
    "longitude": 153.0251,
    "timeZone": "Australia/Brisbane"
  },
  {
    "city": "Perth",
    "region": "WA",
    "country": "Australia",
    "latitude": -31.9523,
    "longitude": 115.8613,
    "timeZone": "Australia/Perth"
  },
  {
    "city": "Auckland",
    "region": "",
    "country": "New Zealand",
    "latitude": -36.8485,
    "longitude": 174.7633,
    "timeZone": "Pacific/Auckland"
  }
];

/** Case-insensitive search over city, region and country. */
export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: { c: City; score: number }[] = [];
  for (const c of CITIES) {
    const city = c.city.toLowerCase();
    const hay = `${city} ${c.region.toLowerCase()} ${c.country.toLowerCase()}`;
    let score = -1;
    if (city === q) score = 0;
    else if (city.startsWith(q)) score = 1;
    else if (hay.includes(q)) score = 2;
    if (score >= 0) scored.push({ c, score });
  }
  scored.sort((a, b) => a.score - b.score || a.c.city.localeCompare(b.c.city));
  return scored.slice(0, limit).map((s) => s.c);
}
