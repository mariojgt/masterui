<template>
  <layout>
    <!-- <navbar /> -->
    <!-- Block start here -->
    <block01/>

    <!-- <TextMultipleSelector
        label="Select your skills"
        model="eyJpdiI6ImpBYjlvcGN6MDJaVkdpMEkyQ1JDUFE9PSIsInZhbHVlIjoid09URHJxTHVNcDVWd0hDeDFIVksrQlRrMW1YdkZHS3E4cjdBSWpYZ0Q4Qkg2eHhMRzlGRWRMZ0tETTBNd2lTWiIsIm1hYyI6ImE3NWYzYzNhMjI5YWI5Y2E5MjJlN2EzNDFiMTMzZWEzN2UwYzZkMjBiZTE3OWNlY2ZjYmIwMWQzZmE0MTQ4ZWYiLCJ0YWciOiIifQ=="
        endpoint="http://skeleton.test/admin/admin/api/generic/table"
        :columns="[
            {
                'key'     :'name',
                'sortable':true,
             },
             {
                'key'     : 'id',
                'sortable': false,
             },
        ]"
        :single-mode="false"
    /> -->

    <Image
        label="Select your skills"
        endpoint="http://skeleton.test/admin/admin/api/media/search"
    />
  </layout>
</template>

<script setup>
import layout from "./components/layout/app.vue";
// navbar
import navbar from "./components/global/navbar.vue";

// Blocks
import block01 from "./components/Block01.vue";
// Import the input component from the packages folder
import { TextMultipleSelector, Image } from "../packages/index.js";

// Update the page tittle
document.title = "Mario Tarosso | Projects";
</script>
