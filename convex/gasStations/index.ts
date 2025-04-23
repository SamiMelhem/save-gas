"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import axios from "axios";

// Generic base prices (national averages)
const BASE_PRICES = {
  regular: 3.25,  // National average base price
  midgrade: 3.65, // Typically about $0.40 more than regular
  premium: 3.95,  // Typically about $0.70 more than regular
  diesel: 3.85,   // Typically about $0.60 more than regular
};

// Regional price adjustments based on state averages
const REGIONAL_PRICE_ADJUSTMENTS: { [key: string]: number } = {
  'AL': 0.95,  // Alabama
  'AK': 1.25,  // Alaska
  'AZ': 1.05,  // Arizona
  'AR': 0.92,  // Arkansas
  'CA': 1.40,  // California
  'CO': 0.98,  // Colorado
  'CT': 1.10,  // Connecticut
  'DE': 1.02,  // Delaware
  'FL': 1.00,  // Florida
  'GA': 0.95,  // Georgia
  'HI': 1.45,  // Hawaii
  'ID': 1.02,  // Idaho
  'IL': 1.08,  // Illinois
  'IN': 1.00,  // Indiana
  'IA': 0.95,  // Iowa
  'KS': 0.92,  // Kansas
  'KY': 0.95,  // Kentucky
  'LA': 0.90,  // Louisiana
  'ME': 1.05,  // Maine
  'MD': 1.05,  // Maryland
  'MA': 1.12,  // Massachusetts
  'MI': 1.02,  // Michigan
  'MN': 0.98,  // Minnesota
  'MS': 0.90,  // Mississippi
  'MO': 0.92,  // Missouri
  'MT': 1.00,  // Montana
  'NE': 0.95,  // Nebraska
  'NV': 1.15,  // Nevada
  'NH': 1.05,  // New Hampshire
  'NJ': 1.08,  // New Jersey
  'NM': 1.00,  // New Mexico
  'NY': 1.15,  // New York
  'NC': 0.98,  // North Carolina
  'ND': 0.95,  // North Dakota
  'OH': 1.00,  // Ohio
  'OK': 0.90,  // Oklahoma
  'OR': 1.15,  // Oregon
  'PA': 1.10,  // Pennsylvania
  'RI': 1.08,  // Rhode Island
  'SC': 0.95,  // South Carolina
  'SD': 0.98,  // South Dakota
  'TN': 0.95,  // Tennessee
  'TX': 0.88,  // Texas
  'UT': 1.02,  // Utah
  'VT': 1.05,  // Vermont
  'VA': 1.00,  // Virginia
  'WA': 1.20,  // Washington
  'WV': 1.00,  // West Virginia
  'WI': 1.00,  // Wisconsin
  'WY': 1.00,  // Wyoming
};

// Smaller price spread for more realistic local variation
const PRICE_VARIATION = 0.15; // Maximum +/- variation in price

// Fuel type multipliers for College Station area
const FUEL_TYPE_MULTIPLIERS = {
  regular: 1.0,
  midgrade: 1.104, // About 10.4% more than regular
  premium: 1.208,  // About 20.8% more than regular
  diesel: 1.138,   // About 13.8% more than regular
};

// Function to get brand-based price adjustment
function getBrandFactor(name: string): number {
  const lowerName = name.toLowerCase();
  
  // Premium brands (slightly higher prices)
  if (lowerName.includes('shell') || 
      lowerName.includes('exxon')) {
    return 0.08;
  }
  
  // Budget brands (lower prices)
  if (lowerName.includes('sams') || 
      lowerName.includes('costco') || 
      lowerName.includes('walmart') ||
      lowerName.includes('heb')) {
    return -0.12;
  }
  
  // Mid-tier brands
  if (lowerName.includes('valero') || 
      lowerName.includes('circle k') || 
      lowerName.includes('chevron')) {
    return 0.03;
  }
  
  return 0;
}

// Function to get state from coordinates using Google's Geocoding API
async function getStateFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results && response.data.results.length > 0) {
      const addressComponents = response.data.results[0].address_components;
      const stateComponent = addressComponents.find(
        (component: any) => component.types.includes('administrative_area_level_1')
      );
      return stateComponent ? stateComponent.short_name : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting state from coordinates:', error);
    return null;
  }
}

export const fetchGasStations = action({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      // Get the state for regional price adjustment
      const state = await getStateFromCoordinates(args.latitude, args.longitude);
      const regionalAdjustment = state ? REGIONAL_PRICE_ADJUSTMENTS[state] || 1 : 1;

      // Direct API call to Google Places
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${args.latitude},${args.longitude}&type=gas_station&rankby=distance&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      console.log("Calling URL:", url);
      const response = await axios.get(url);
      
      // Log the entire response for debugging
      console.log("Full API Response:", JSON.stringify(response.data, null, 2));
      
      if (response.data.status === "OK") {
        // Get the number of nearby stations for competition factor
        const totalNearbyStations = response.data.results.length;
        const competitionFactor = -0.05 * (totalNearbyStations / 10);

        // Return just the first 10 stations with simplified data and generated prices
        return response.data.results.slice(0, 10).map((place: any) => {
          const brandFactor = getBrandFactor(place.name);
          const stationVariation = (Math.random() * 2 - 1) * PRICE_VARIATION;
          
          // Calculate base price with all factors including regional adjustment
          const basePrice = (BASE_PRICES.regular + stationVariation + brandFactor + competitionFactor) * regionalAdjustment;
          
          // Generate prices for all fuel types
          const prices = {
            regular: Math.round(basePrice * 100) / 100,
            midgrade: Math.round(basePrice * FUEL_TYPE_MULTIPLIERS.midgrade * 100) / 100,
            premium: Math.round(basePrice * FUEL_TYPE_MULTIPLIERS.premium * 100) / 100,
            diesel: Math.round(basePrice * FUEL_TYPE_MULTIPLIERS.diesel * 100) / 100,
          };

          return {
            name: place.name,
            vicinity: place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            place_id: place.place_id,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            prices,
            state: state || 'Unknown',
            lastUpdated: Date.now()
          };
        });
      } else {
        console.error("API Error Status:", response.data.status);
        console.error("API Error Message:", response.data.error_message);
        return {
          error: response.data.status,
          message: response.data.error_message
        };
      }
    } catch (error: any) {
      console.error("Error fetching stations:", error.message);
      return { error: "FETCH_ERROR", message: error.message };
    }
  }
}); 