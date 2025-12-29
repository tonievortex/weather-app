<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GetWeather, type WeatherData } from "../service/weather.service";
import { format } from "date-fns";

const weather = ref<WeatherData | null>(null);
const city = "Europe/Warsaw";
onMounted(async () => {
  weather.value = await GetWeather(city);
});

const today = new Date();

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Satu", "Sun"];
</script>

<template>
  <div
    class="w-full h-screen flex justify-center bg-[url(../assets/bg.jpg)] bg-no-repeat bg-cover bg-center items-center"
  >
    <div
      class="w-130 h-160 rounded-[80px] bg-gray-200/40 p-7 pt-10 flex-row flex"
    >
      <div class="w-120 h-60 rounded-[80px] bg-gray-600/80">
        <img
          src="../assets/cloud.png"
          alt="Hmurka :)"
          class="w-[30%] h-[20%] mt-20"
        />
        <div
          class="flex flex-col h-30 w-full mr-10 text-xl font-sans items-center"
        >
          <p>{{ format(today, "EEEE") }}, {{ format(today, "HH:mm") }}</p>
          <p class="text-2xl text-white">
            Cloudy {{ weather ? weather.temperature + "°C" : "loading..." }}
          </p>
        </div>
        <div class="flex flex-row gap-3 justify-center items-center mt-10">
          <div
            v-for="day in days"
            class="bg-gray-600 text-gray-200 rounded-4xl h-50 w-14 flex justify-center"
          >
            <p class="mt-5 text-xs">{{ day }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
