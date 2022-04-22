<template>
  <div class="p-6 pb-16">
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <!-- <div class="avatar">
            <div class="w-24 rounded-full">
              <img
                src="https://raw.githubusercontent.com/mariojgt/mariojgt/main/mario_avatar.png"
              />
            </div>
          </div> -->
          <h1 class="text-5xl font-bold p-3">Master UI</h1>
          <div class="badge">Inersia js</div>
          <div class="badge badge-primary">Vue js 3</div>
          <div class="badge badge-secondary">Daisy ui</div>
          <div class="badge badge-outline">Tailwind</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>
