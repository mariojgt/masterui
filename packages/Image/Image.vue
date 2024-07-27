<template>
    <div class="form-control">
        <label class="label">
            <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
        </label>

        <input
            class="input input-primary input-bordered"
            :name="props.name"
            :id="props.id"
            :placeholder="props.placeholder"
            v-model="searchString"
            autocomplete="off"
            @keyup="searchImage"
        />

        <span
            class="invalid-feedback text-primary mt-2"
            role="alert"
            v-if="errorMessage"
        >
            <strong>{{ errorMessage }}</strong>
        </span>

        <div class="mt-3 bg-base-100 rounded" v-if="availableSearchItems.data[0]">
            <div class="px-2 py-3 bg-primary text-white rounded-t">
                <strong>Available Items</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-dark-100">
                <div
                    class="flex flex-col items-center border border-success p-3 hover:text-white rounded cursor-pointer"
                    v-for="(item, index) in availableSearchItems.data"
                    :key="item.id"
                    @click="addMedia(item)"
                >
                    <img
                        :src="item.url.default"
                        class="h-60 w-auto mb-2"
                    />
                    <strong class="text-lg font-bold">{{ item.name }}</strong>
                    <button class="btn btn-success mt-2 w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 mt-2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-3 bg-base-300 rounded" v-if="selectedMedia.length > 0">
            <div class="px-2 py-3 bg-primary text-white rounded-t">
                <strong>Selected Items</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                <div
                    class="flex flex-col items-center border border-error p-3 hover:text-white rounded cursor-pointer"
                    v-for="(item, index) in selectedMedia"
                    :key="item.id"
                >
                    <img
                        :src="item.url.default"
                        class="h-60 w-auto mb-2"
                    />
                    <strong class="text-lg font-bold">{{ item.name }}</strong>
                    <button @click="removeMedia(index)" class="btn btn-error mt-2 w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 mt-2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
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
