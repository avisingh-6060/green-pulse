import axios from "axios";

export const getCoordinates = async (city: string) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q: city,
        },
        headers: {
          "User-Agent": "green-path-app",
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return null;
    }

    return {
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
    };
  } catch (error: any) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};
