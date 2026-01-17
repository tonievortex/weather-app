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
  lat: string;
  lon: string;
}

async function getCity(city: string): Promise<cityData> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
  const response = await axios.get<any[]>(url);
  const data = response.data[0];

  if (!data) {
    throw new Error(`City '${city}' not found`);
  }
  return {
    lat: data.lat,
    lon: data.lon,
  };
}

export async function GetWeather(): Promise<WeatherData | null> {
  try {
    const city = await getCity("Warsaw");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;

    const response = await axios.get(url);
    const rawData = response.data;
    const current = rawData.current_weather;

    return {
      ...current,
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      generationtime_ms: rawData.generationtime_ms,
      utc_offset_seconds: rawData.utc_offset_seconds,
      timezone: rawData.timezone,
      timezone_abbreviation: rawData.timezone_abbreviation,
      elevation: rawData.elevation,
    } as WeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
