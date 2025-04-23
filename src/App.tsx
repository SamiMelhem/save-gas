import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { TermsOfService } from "./TermsOfService";
import { PrivacyPolicy } from "./PrivacyPolicy";
import logo from "./assets/logo.svg";

//   {
//     "latitude": 30.6061654,
//     "longitude": -96.33705169999999,
//     "name": "Shell",
//     "place_id": "ChIJ_UEGt52DRoYRA0_tacp60KU",
//     "rating": 1.6,
//     "user_ratings_total": 16,
//     "vicinity": "400 George Bush Drive, College Station"
//   },
//   {
//     "latitude": 30.6061427,
//     "longitude": -96.3369465,
//     "name": "Max Food Mart",
//     "place_id": "ChIJJ2Zot52DRoYRdVXSBAj_u08",
//     "rating": 2.3,
//     "user_ratings_total": 7,
//     "vicinity": "400 George Bush Drive, College Station"
//   },
//   {
//     "latitude": 30.6201524,
//     "longitude": -96.34376669999999,
//     "name": "Sunoco",
//     "place_id": "ChIJD1DuApaDRoYRBlVDAIQoKyU",
//     "rating": 1,
//     "user_ratings_total": 3,
//     "vicinity": "609 University Drive, College Station"
//   },
//   {
//     "latitude": 30.6245885,
//     "longitude": -96.3305233,
//     "name": "Valero",
//     "place_id": "ChIJxdUI_oyDRoYR3iduxnVn7TU",
//     "rating": 3.9,
//     "user_ratings_total": 24,
//     "vicinity": "901 Texas Avenue, College Station"
//   },
//   {
//     "latitude": 30.6006332,
//     "longitude": -96.3431055,
//     "name": "Brookshire Brothers Fuel",
//     "place_id": "ChIJu2fl13SDRoYR47Dgj-D-9d8",
//     "rating": 4.7,
//     "user_ratings_total": 3,
//     "vicinity": "455 George Bush Drive West, College Station"
//   },
//   {
//     "latitude": 30.6006229,
//     "longitude": -96.3276844,
//     "name": "Valero",
//     "place_id": "ChIJS5tgXgCDRoYR5QDc_zymBAE",
//     "rating": 5,
//     "user_ratings_total": 1,
//     "vicinity": "604 Holleman Drive, College Station"
//   },
//   {
//     "latitude": 30.600553,
//     "longitude": -96.327501,
//     "name": "Checkers Food Mart",
//     "place_id": "ChIJF9CGzn6DRoYRi-xVuhe5qOQ",
//     "rating": 5,
//     "user_ratings_total": 3,
//     "vicinity": "604 Holleman Drive, College Station"
//   },
//   {
//     "latitude": 30.6156623,
//     "longitude": -96.31904109999999,
//     "name": "Exxon",
//     "place_id": "ChIJC0-k23mERoYRiaKsIw7gEac",
//     "rating": 4,
//     "user_ratings_total": 285,
//     "vicinity": "1721 Texas Avenue, College Station"
//   },
//   {
//     "latitude": 30.6282419,
//     "longitude": -96.33492530000001,
//     "name": "Exxon",
//     "place_id": "ChIJE36PPu2DRoYRJ2l6L45Av5c",
//     "rating": 4,
//     "user_ratings_total": 142,
//     "vicinity": "425 South Texas Avenue, College Station"
//   },
//   {
//     "latitude": 30.6130863,
//     "longitude": -96.3172191,
//     "name": "H-E-B Fuel",
//     "place_id": "ChIJ_aGWhnmERoYRJOz674big58",
//     "rating": 4.5,
//     "user_ratings_total": 148,
//     "vicinity": "1900 Texas Avenue, College Station"
//   }
// ]


const containerStyle = {
  width: '100%',
  height: '400px'
};

// Add sorting options
const sortOptions = {
  PRICE_LOW: 'Price: Low to High',
  DISTANCE: 'Distance',
  RATING: 'Rating'
} as const;

type SortOption = keyof typeof sortOptions;

// Fuel type options
const FUEL_TYPES = {
  regular: 'Regular',
  midgrade: 'Midgrade',
  premium: 'Premium',
  diesel: 'Diesel'
} as const;

type FuelType = keyof typeof FUEL_TYPES;

interface Location {
  lat: number;
  lng: number;
  latitude: number;
  longitude: number;
}

interface GasStation {
  _id: Id<"gasStations">;
  _creationTime: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  prices: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
  price?: number;
  lastUpdated: number;
  placeId: string;
  rating: number;
  userRatingsTotal: number;
  openNow: boolean;
  state?: string;
  cacheTimestamp?: number;
  distance?: number;
  isOpen?: boolean;
}

// Helper function to get price safely
const getPrice = (station: GasStation, type: FuelType): number => {
  return station.prices?.[type] ?? station.price ?? 0;
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Convert latitude and longitude from degrees to radians
  const lat1Rad = deg2rad(lat1);
  const lon1Rad = deg2rad(lon1);
  const lat2Rad = deg2rad(lat2);
  const lon2Rad = deg2rad(lon2);

  // Haversine formula
  const R = 3959; // Radius of the earth in miles (use 6371 for kilometers)
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in miles

  // Round to 2 decimal places
  return Math.round(distance * 100) / 100;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  console.log("App component rendering"); // Debug log

  const { isLoading: authLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  
  // Debug logs for auth state
  console.log("Auth loading:", authLoading);
  console.log("Is authenticated:", isAuthenticated);

  const [location, setLocation] = useState<Location | null>(null);
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("PRICE_LOW");
  const [fuelType, setFuelType] = useState<FuelType>("regular");
  const [isLoading, setIsLoading] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<GasStation[]>([]);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const REFRESH_COOLDOWN = 60000; // 60 seconds cooldown

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry']
  });

  console.log("Google Maps loaded:", isLoaded); // Debug log

  const fetchGasStations = useAction(api.gasStations.index.fetchGasStations);

  // Add countdown timer effect
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (lastRefreshTime > 0) {
      const updateRemainingTime = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((REFRESH_COOLDOWN - (now - lastRefreshTime)) / 1000));
        setRemainingTime(remaining);
        
        // Clear interval when countdown reaches 0
        if (remaining === 0 && intervalId) {
          window.clearInterval(intervalId);
        }
      };

      // Update immediately and then every second
      updateRemainingTime();
      intervalId = window.setInterval(updateRemainingTime, 1000);
    }

    // Cleanup interval on unmount or when lastRefreshTime changes
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [lastRefreshTime]);

  useEffect(() => {
    if (isAuthenticated && !location) {
      getLocation();
    }
  }, [isAuthenticated]);

  const getLocation = async () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      const remainingTime = Math.ceil((REFRESH_COOLDOWN - (now - lastRefreshTime)) / 1000);
      setError(`Please wait ${remainingTime} seconds before refreshing again`);
      return;
    }

    console.log("Getting location..."); // Debug log
    if (navigator.geolocation) {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Location received:", newLocation);
          setLocation(newLocation);
          try {
            console.log("Fetching gas stations for coordinates:", {
              latitude: newLocation.latitude,
              longitude: newLocation.longitude
            });
            
            const result = await fetchGasStations({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude
            });
            
            if (Array.isArray(result)) {
              // Transform the result to match GasStation interface
              const transformedStations = result.map(station => ({
                _id: station.place_id as Id<"gasStations">,
                _creationTime: station.lastUpdated,
                name: station.name,
                address: station.vicinity,
                latitude: station.latitude,
                longitude: station.longitude,
                prices: station.prices,
                lastUpdated: station.lastUpdated,
                placeId: station.place_id,
                rating: station.rating || 0,
                userRatingsTotal: station.user_ratings_total || 0,
                openNow: true,
                state: station.state || 'Unknown',
                distance: calculateDistance(
                  newLocation.latitude,
                  newLocation.longitude,
                  station.latitude,
                  station.longitude
                )
              }));
              
              setStations(transformedStations);
              setLastRefreshTime(now); // Update last refresh time after successful fetch
              console.log("Fetched and transformed stations:", transformedStations);
            } else {
              console.error("Invalid response format:", result);
              setError("Failed to fetch gas stations: Invalid response format");
            }
          } catch (error) {
            console.error("Error fetching gas stations:", error);
            setError("Failed to fetch gas stations");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError(`Failed to get location: ${error.message}`);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation not supported");
      setError("Geolocation is not supported by your browser");
    }
  };

  const getDirections = useCallback((station: GasStation) => {
    if (!location) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new google.maps.LatLng(location.latitude, location.longitude),
        destination: new google.maps.LatLng(station.latitude, station.longitude),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [location]);

  const testFetchNearbyStations = async () => {
    if (!location) {
      console.error("No location available");
      return;
    }
    
    try {
      console.log("Testing fetch with location:", location);
      const result = await fetchGasStations({
        latitude: location.latitude,
        longitude: location.longitude
      });
      console.log("Test fetch result:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Test fetch error:", error);
    }
  };

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: 'login',
      },
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <img src={logo} alt="SaveGas Logo" className="w-16 h-16 mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105">
          <div className="text-center mb-8">
            {/* Logo */}
            <img src={logo} alt="SaveGas Logo" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">SaveGas</h1>
            <p className="text-gray-600 mb-6">Find the best gas prices near you</p>
            
            {/* Features section */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
              <div className="flex items-start space-x-2">
                <svg 
                  className="w-5 h-5 text-green-500 mt-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-sm text-gray-600">Real-time price updates</span>
              </div>
              <div className="flex items-start space-x-2">
                <svg 
                  className="w-5 h-5 text-green-500 mt-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-sm text-gray-600">Compare nearby stations</span>
              </div>
              <div className="flex items-start space-x-2">
                <svg 
                  className="w-5 h-5 text-green-500 mt-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-sm text-gray-600">Interactive maps</span>
              </div>
              <div className="flex items-start space-x-2">
                <svg 
                  className="w-5 h-5 text-green-500 mt-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-sm text-gray-600">Turn-by-turn directions</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-3 font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-105"
          >
            <div className="flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                />
              </svg>
              Sign In to Get Started
            </div>
          </button>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-blue-500 hover:text-blue-600">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-500 hover:text-blue-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  const filteredStations = stations
    .filter((station) => station?.prices?.[fuelType] !== undefined)
    .map((station) => ({
      ...station,
      distance: location ? calculateDistance(
        location.latitude,
        location.longitude,
        station.latitude,
        station.longitude
      ) : Infinity
    }))
    .sort((a, b) => {
      switch (sortBy) {
        case "PRICE_LOW":
          return getPrice(a, fuelType) - getPrice(b, fuelType);
        case "DISTANCE":
          return (a.distance || Infinity) - (b.distance || Infinity);
        case "RATING":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="SaveGas Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-gray-800">SaveGas</h1>
          </div>
          <button 
            onClick={() => logout()}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="rounded-lg border border-gray-300 px-4 py-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(FUEL_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 px-4 py-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => getLocation()}
            disabled={isLoading || remainingTime > 0}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-white font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : remainingTime > 0 ? (
              `Wait ${remainingTime}s`
            ) : (
              "Refresh"
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredStations.length > 0 ? (
            <div className="space-y-4">
              {filteredStations.map((station, index) => (
                    <div 
                      key={station._id} 
                  className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedStation(station);
                    getDirections(station);
                  }}
                >
                  <div className="flex items-start justify-between">
                        <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-sm text-white font-semibold">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-800">{station.name}</h3>
                          </div>
                      <p className="text-sm text-gray-600 mt-1">{station.address}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${getPrice(station, fuelType).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">{FUEL_TYPES[fuelType]}</span>
                      </div>
                      {station.distance !== undefined && (
                        <p className="text-sm text-gray-500 mt-1">
                          {station.distance.toFixed(2)} miles away
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No gas stations found. Try refreshing or changing filters.
              </div>
            )}
          </div>

        <div className="bg-white rounded-2xl shadow-lg h-[600px] overflow-hidden">
          {!isLoaded ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={location || { lat: 0, lng: 0 }}
              zoom={13}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true
              }}
            >
              {location && (
                <Marker
                  position={location}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                  }}
                />
              )}
              {filteredStations.map((station, index) => (
                <Marker
                  key={station._id}
                  position={{ lat: station.latitude, lng: station.longitude }}
                  onClick={() => {
                    setSelectedStation(station);
                    getDirections(station);
                  }}
                  label={{
                    text: (index + 1).toString(),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              ))}
              {selectedStation && (
                <InfoWindow
                  position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                  onCloseClick={() => setSelectedStation(null)}
                >
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-800 mb-1">{selectedStation.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{selectedStation.address}</p>
                    <p className="text-sm font-semibold text-green-600">
                      ${getPrice(selectedStation, fuelType).toFixed(2)} - {FUEL_TYPES[fuelType]}
                    </p>
                    {selectedStation.distance !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedStation.distance.toFixed(2)} miles away
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}
