<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import { GetWeather, type WeatherData } from "../service/weather.service";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

const weather = ref<WeatherData | null>(null);
const errorOccurred = ref(false);

function getWarsawDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" })
  );
}

const currentTime = ref(getWarsawDate());
const today = computed(() => currentTime.value);

let clockTimer: ReturnType<typeof setInterval> | null = null;
let weatherTimer: ReturnType<typeof setInterval> | null = null;

async function updateWeather() {
  console.log("Aktualizacja pogody...");
  try {
    const data = await GetWeather();
    console.log("Dane z API:", data); // Sprawdź to w konsoli!

    // Sprawdzamy czy dane mają wymagane pola, aby uniknąć błędu toFixed
    if (data && typeof data.latitude === "number") {
      weather.value = data;
      errorOccurred.value = false;
    } else {
      console.error("API zwróciło niepełne dane:", data);
      errorOccurred.value = true;
    }
  } catch (error) {
    console.error("Błąd pobierania pogody:", error);
    errorOccurred.value = true;
  }
}

onMounted(() => {
  updateWeather();
  clockTimer = setInterval(() => {
    currentTime.value = getWarsawDate();
  }, 1000);
  weatherTimer = setInterval(() => {
    updateWeather();
  }, 60000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  if (weatherTimer) clearInterval(weatherTimer);
});

function getFormattedDay(date: Date) {
  const day = format(date, "EEEE", { locale: pl });
  return day.charAt(0).toUpperCase() + day.slice(1);
}
</script>

<template>
  <div
    class="w-full h-screen flex justify-center items-center bg-linear-to-b from-[#2e4470] via-[#4d628c] to-[#928ab1]"
  >
    <div
      class="w-130 h-160 rounded-[80px] p-7 pt-10 flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden text-white"
    >
      <div
        v-if="weather && weather.latitude !== undefined"
        class="text-center w-full animate-in fade-in duration-500"
      >
        <h2 class="text-3xl font-semibold mb-1">Warszawa</h2>

        <p class="text-sm opacity-70 mb-4">
          {{ weather.latitude.toFixed(2) }}°N,
          {{ weather.longitude.toFixed(2) }}°E
        </p>

        <div class="mb-8">
          <p class="text-xl">{{ getFormattedDay(today) }}</p>
          <p class="text-5xl font-light tracking-tighter tabular-nums">
            {{ format(today, "HH:mm:ss") }}
          </p>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-8xl font-thin ml-4">
            {{ Math.round(weather.temperature ?? 0) }}°
          </span>
          <p class="text-2xl font-medium mt-2">Pochmurnie</p>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-full">
        <div v-if="!errorOccurred" class="flex flex-col items-center">
          <div
            class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"
          ></div>
          <p class="text-lg animate-pulse">Ładowanie danych...</p>
        </div>
        <div v-else class="text-center p-4">
          <p class="text-red-300 mb-2">Błąd danych API</p>
          <p class="text-xs opacity-50 mb-4">
            Sprawdź konsolę (F12), aby zobaczyć format danych.
          </p>
          <button
            @click="updateWeather"
            class="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
