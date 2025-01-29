<template>
    <div class="form-control">
        <!-- Label and Search Section -->
        <label class="label">
            <span class="text-lg font-bold text-base-content">{{ props.label }}</span>
        </label>

        <!-- Search Input with Icon -->
        <div class="relative mb-4">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                class="input input-primary input-bordered w-full pl-10"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                v-model="searchString"
                autocomplete="off"
                @keyup="searchImage"
            />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Available Items Section -->
        <div v-if="availableSearchItems.data[0]" class="card bg-base-100 shadow-xl mb-6">
            <div class="card-header px-6 py-4 bg-primary text-primary-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <strong class="text-xl">Available Items</strong>
            </div>
            <div class="card-body p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="(item, index) in availableSearchItems.data"
                        :key="item.id"
                        class="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer group"
                        @click="addMedia(item)"
                    >
                        <figure class="relative pt-4 px-4">
                            <img
                                :src="item.url.default"
                                :alt="item.name"
                                class="h-60 w-full object-cover rounded-xl"
                            />
                            <div class="absolute inset-0 bg-success/0 group-hover:bg-success/10 transition-all duration-300 rounded-xl"></div>
                        </figure>
                        <div class="card-body p-4 text-center">
                            <h3 class="font-bold text-lg mb-2 truncate">{{ item.name }}</h3>
                            <button class="btn btn-success btn-sm w-full gap-2 group-hover:btn-active">
                                <span>Select</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Items Section -->
        <div v-if="selectedMedia.length > 0" class="card bg-base-100 shadow-xl">
            <div class="card-header px-6 py-4 bg-secondary text-secondary-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <strong class="text-xl">Selected Items</strong>
            </div>
            <div class="card-body p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="(item, index) in selectedMedia"
                        :key="item.id"
                        class="card bg-base-200 group"
                    >
                        <figure class="relative pt-4 px-4">
                            <img
                                :src="item.url.default"
                                :alt="item.name"
                                class="h-60 w-full object-cover rounded-xl"
                            />
                            <div class="absolute inset-0 bg-error/0 group-hover:bg-error/10 transition-all duration-300 rounded-xl"></div>
                        </figure>
                        <div class="card-body p-4 text-center">
                            <h3 class="font-bold text-lg mb-2 truncate">{{ item.name }}</h3>
                            <button @click="removeMedia(index)" class="btn btn-error btn-sm w-full gap-2 group-hover:btn-active">
                                <span>Remove</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps, defineEmits } from "vue";
import axios from "axios";

// Define types for media items
interface MediaItem {
    id: number;
    name: string;
    url: {
        default: string;
    };
}

// Define component props
const props = defineProps<{
    label: string;
    name: string;
    id: string;
    placeholder: string;
    modelValue: MediaItem[];
    endpoint: string;
    loadData?: MediaItem[]; // Optional prop for pre-loaded data
}>();

// Define component state
let searchString = ref<string>("");
let availableSearchItems = ref<{ data: MediaItem[] }>({ data: [] });
let selectedMedia = ref<MediaItem[]>(props.modelValue || []);
let errorMessage = ref<string | null>(null);

// Watch for changes in pre-loaded data
watchEffect(() => {
    selectedMedia.value = props.loadData || [];
});

// Define the emit function for updating modelValue
const emit = defineEmits(["update:modelValue"]);

// Function to search for images
const searchImage = () => {
    axios
        .post<{ data: MediaItem[] }>(props.endpoint, {
            search: searchString.value,
        })
        .then((response) => {
            availableSearchItems.value = response.data;
        })
        .catch((error) => {
            errorMessage.value = error.message;
        });
};

// Function to add a media item
const addMedia = (item: MediaItem) => {
    if (!selectedMedia.value.find((media) => media.id === item.id)) {
        selectedMedia.value.push(item);
        emit("update:modelValue", selectedMedia.value);
    }
    availableSearchItems.value = { data: [] };
};

// Function to remove a media item
const removeMedia = (index: number) => {
    selectedMedia.value.splice(index, 1);
    emit("update:modelValue", selectedMedia.value);
};
</script>
