<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Media Select Example</h2>

      <p class="mb-4">
        This is an example of a media select input component with the ability to search and select media items.
      </p>

      <div class="">
        <Image
          label="Select Media"
          name="mediaSelect"
          id="mediaSelect"
          placeholder="Search for media"
          :modelValue="selectedMedia"
          endpoint="/api/media/search"
          :loadData="preloadedMedia"
        />
      </div>

      <p class="mt-4">
        Selected media: {{ selectedMedia }}
      </p>
    </div>
  </template>

  <script setup>
  // Import the MediaSelect component from the packages folder
  import { ref } from 'vue';
  import { Image } from "../../../packages/index.js";

  // Preloaded media data
  const preloadedMedia = [
    { id: 1, name: 'Image 1', url: { default: 'https://picsum.photos/200' } },
    { id: 2, name: 'Image 2', url: { default: 'https://picsum.photos/300' } },
  ];

  // Selected media
  const selectedMedia = ref([]);
  </script>
