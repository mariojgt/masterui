<template>
    <div class="form-control w-full">
        <!-- Minimalist Header -->
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-base-content">{{ props.label }}</h3>
            </div>
            <p class="text-sm text-base-content/60 ml-9">Search and organize your product images</p>
        </div>

        <!-- Clean Search Bar -->
        <div class="relative mb-8">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                class="input input-bordered w-full pl-12 pr-12 h-12 rounded-xl bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-all duration-200"
                :placeholder="props.placeholder"
                v-model="searchString"
                @input="searchImage"
            />
            <div v-if="isSearching" class="absolute right-4 top-1/2 -translate-y-1/2">
                <span class="loading loading-spinner loading-sm text-primary"></span>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="errorMessage" class="alert alert-error mb-6 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Search Results -->
        <div v-if="availableSearchItems.data.length > 0" class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <h4 class="text-base font-medium text-base-content">Available Images</h4>
                <div class="badge badge-primary badge-outline">{{ availableSearchItems.data.length }} found</div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div
                    v-for="item in availableSearchItems.data"
                    :key="item.id"
                    class="group relative aspect-square rounded-xl overflow-hidden bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg"
                    @click="addMedia(item)"
                >
                    <img
                        :src="item.url.default"
                        :alt="item.name"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                    <div class="absolute bottom-2 left-2 right-2">
                        <div class="bg-base-100/95 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-base-300/50">
                            <p class="text-xs font-medium text-base-content truncate">{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Images with Drag & Drop -->
        <div v-if="selectedMedia.length > 0">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <h4 class="text-base font-medium text-base-content">Selected Images</h4>
                    <div class="badge badge-secondary">{{ selectedMedia.length }}</div>
                </div>
                <div class="flex items-center gap-2 text-sm text-base-content/60">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span>Drag to reorder</span>
                </div>
            </div>

            <!-- Drag & Drop Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative">
                <!-- Drop Zone Indicators -->
                <div
                    v-for="(_, index) in selectedMedia.length + 1"
                    :key="`drop-zone-${index}`"
                    v-show="draggedIndex !== null && index !== draggedIndex && index !== draggedIndex + 1"
                    class="absolute w-1 bg-primary rounded-full transition-all duration-200 z-20"
                    :class="{
                        'h-full opacity-100': dropTargetIndex === index,
                        'h-0 opacity-0': dropTargetIndex !== index
                    }"
                    :style="getDropZoneStyle(index)"
                ></div>

                <div
                    v-for="(item, index) in selectedMedia"
                    :key="item.id"
                    class="group relative aspect-square rounded-xl overflow-hidden bg-base-100 border-2 transition-all duration-200 select-none"
                    :class="{
                        'border-base-300 hover:border-primary/50 cursor-move': draggedIndex !== index,
                        'border-primary/50 opacity-50 scale-95 rotate-1 cursor-grabbing': draggedIndex === index,
                        'border-dashed border-primary/30': dropTargetIndex === index && draggedIndex !== index
                    }"
                    :draggable="true"
                    @dragstart="handleDragStart(index, $event)"
                    @dragend="handleDragEnd"
                    @dragover.prevent="handleDragOver(index, $event)"
                    @drop="handleDrop(index, $event)"
                    @dragenter.prevent="handleDragEnter(index)"
                    @dragleave="handleDragLeave"
                >
                    <!-- Order Number -->
                    <div class="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-secondary text-secondary-content flex items-center justify-center text-xs font-bold shadow-sm">
                        {{ index + 1 }}
                    </div>

                    <!-- Primary Badge -->
                    <div v-if="index === 0" class="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-success text-success-content text-xs font-medium shadow-sm">
                        Primary
                    </div>

                    <!-- Drag Handle -->
                    <div class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-base-content/80 text-base-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
                         :class="{ 'right-16': index === 0 }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div>

                    <!-- Image -->
                    <img
                        :src="item.url.default"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>

                    <!-- Remove Button -->
                    <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            @click.stop="removeMedia(index)"
                            class="w-8 h-8 rounded-full bg-error text-error-content flex items-center justify-center hover:bg-error/80 transition-colors duration-200 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Image Name -->
                    <div class="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div class="max-w-32 px-2 py-1 rounded-md bg-base-100/95 backdrop-blur-sm border border-base-300/50 shadow-sm">
                            <p class="text-xs font-medium text-base-content truncate">{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tips -->
            <div class="mt-8 p-4 bg-info/5 border border-info/20 rounded-xl">
                <div class="flex items-start gap-3">
                    <div class="w-5 h-5 text-info mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="text-sm text-base-content/70">
                        <span class="font-medium text-info">Tip:</span> The first image will be your main product photo. Drag images to reorder them, and the blue line shows where they'll be placed.
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="selectedMedia.length === 0 && !availableSearchItems.data.length && !searchString" class="text-center py-16">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-base-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-base-content mb-2">No images added yet</h3>
            <p class="text-base-content/60 mb-6">Search above to find and add images to your product</p>
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-base-200 rounded-full text-sm text-base-content/60">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Start typing to search</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps, defineEmits, computed } from "vue";
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
    loadData?: MediaItem[];
}>();

// Define component state
let searchString = ref<string>("");
let availableSearchItems = ref<{ data: MediaItem[] }>({ data: [] });
let selectedMedia = ref<MediaItem[]>(props.modelValue || []);
let errorMessage = ref<string | null>(null);
let isSearching = ref<boolean>(false);

// Drag and drop state
let draggedIndex = ref<number | null>(null);
let dropTargetIndex = ref<number | null>(null);

// Watch for changes in pre-loaded data
watchEffect(() => {
    if (props.loadData) {
        selectedMedia.value = [...props.loadData];
    }
});

// Define the emit function for updating modelValue
const emit = defineEmits(["update:modelValue"]);

// Function to search for images with debouncing
let searchTimeout: NodeJS.Timeout;
const searchImage = () => {
    clearTimeout(searchTimeout);

    if (!searchString.value.trim()) {
        availableSearchItems.value = { data: [] };
        isSearching.value = false;
        return;
    }

    isSearching.value = true;
    searchTimeout = setTimeout(async () => {
        try {
            const response = await axios.post<{ data: MediaItem[] }>(props.endpoint, {
                search: searchString.value,
            });
            availableSearchItems.value = response.data;
            errorMessage.value = null;
        } catch (error: any) {
            errorMessage.value = error.response?.data?.message || error.message || "Failed to search images";
            availableSearchItems.value = { data: [] };
        } finally {
            isSearching.value = false;
        }
    }, 300);
};

// Function to add a media item
const addMedia = (item: MediaItem) => {
    if (!selectedMedia.value.find((media) => media.id === item.id)) {
        selectedMedia.value.push(item);
        emit("update:modelValue", selectedMedia.value);
    }
    // Clear search results after selection
    availableSearchItems.value = { data: [] };
    searchString.value = "";
};

// Function to remove a media item
const removeMedia = (index: number) => {
    selectedMedia.value.splice(index, 1);
    emit("update:modelValue", selectedMedia.value);
};

// Function to get drop zone position
const getDropZoneStyle = (index: number) => {
    const cols = window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
    const itemWidth = 100 / cols;
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (col === 0) {
        return {
            left: '-2px',
            top: `${row * (100 + 16)}px` // 100px height + 16px gap
        };
    } else {
        return {
            left: `calc(${col * itemWidth}% - 2px)`,
            top: `${row * (100 + 16)}px`
        };
    }
};

// Drag and Drop Functions
const handleDragStart = (index: number, event: DragEvent) => {
    draggedIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', '');
    }
};

const handleDragEnd = () => {
    draggedIndex.value = null;
    dropTargetIndex.value = null;
};

const handleDragOver = (index: number, event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
};

const handleDrop = (targetIndex: number, event: DragEvent) => {
    event.preventDefault();

    if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
        return;
    }

    // Create a new array with reordered items
    const newSelectedMedia = [...selectedMedia.value];
    const draggedItem = newSelectedMedia[draggedIndex.value];

    // Remove the dragged item
    newSelectedMedia.splice(draggedIndex.value, 1);

    // Insert at new position
    const insertIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex;
    newSelectedMedia.splice(insertIndex, 0, draggedItem);

    selectedMedia.value = newSelectedMedia;
    emit("update:modelValue", selectedMedia.value);

    draggedIndex.value = null;
    dropTargetIndex.value = null;
};

// Handle drag enter for visual feedback
const handleDragEnter = (index: number) => {
    if (draggedIndex.value !== null && draggedIndex.value !== index) {
        dropTargetIndex.value = index;
    }
};

const handleDragLeave = () => {
    // Only clear if we're not over a child element
    setTimeout(() => {
        dropTargetIndex.value = null;
    }, 10);
};
</script>

<style scoped>
/* Custom scrollbar for grid areas */
.grid::-webkit-scrollbar {
    display: none;
}

.grid {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

/* Smooth transitions */
* {
    transition-property: transform, opacity, background-color, border-color, box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Drag cursor states */
[draggable="true"] {
    cursor: grab;
}

[draggable="true"]:active {
    cursor: grabbing;
}

/* Drop zone animation */
.drop-zone-line {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 0.5;
    }
    50% {
        opacity: 1;
    }
}
</style>
