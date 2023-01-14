<template>
  <layout>
    <!-- <navbar /> -->

    <!-- Block start here -->
    <block01 />

    <div class="form-control">
        <Image label="image" placeholder="search" v-model="infoTest" endpoint="http://skeleton.test/admin/admin/api/media/search" />
        {{ infoTest }}
    </div>

  </layout>
</template>

<script setup>
import layout from "./components/layout/app.vue";
// navbar
import navbar from "./components/global/navbar.vue";

// Blocks
import block01 from "./components/Block01.vue";
// Import the input component from the packages folder
import { Image } from "../packages/index.js";

let infoTest = $ref([]);

// Update the page tittle
document.title = "Mario Tarosso | Projects";
</script>
