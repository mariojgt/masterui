<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Multiple text select</h2>

      <p class="mb-4">
        This is an example of a media select input component with the ability to search and select media items.
      </p>

      <div class="">
        <TextMultipleSelector
          label="Search Text"
          name="mediaSelect"
          id="textSearch"
          placeholder="Search Text"
          :modelValue="selectedMedia"
          endpoint="/api/media/search"
          :loadData="preloadedMedia"
        />
      </div>

      <p class="mt-4">
        Selected text: {{ selectedText }}
      </p>
    </div>
  </template>

  <script setup>
  // Import the search text component from the packages folder
  import { ref } from 'vue';
  import { TextMultipleSelector } from "../../../packages/index.js";

  // Preloaded media data
  const preloadedMedia = [
    { id: 1, name: 'Text 01'},
    { id: 2, name: 'Text 01'},
  ];

  // Selected media
  const selectedText = ref([]);
  </script>
