import axios from "axios";

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

interface cityData {
  lat: number;
  lon: number;
}

async function getCity(city: string): Promise<cityData> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
  const data = (await axios.get<cityData[]>(url)).data[0];
  if (!data) {
    throw new Error(`City '${city}' not found`);
  }
  return data;
}

export async function GetWeather(
  City: string | "Europe/Warsaw"
): Promise<WeatherData | null> {
  const city = await getCity("Warsaw");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;

  try {
    const response = await axios.get(url);
    return response.data.current_weather as WeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
