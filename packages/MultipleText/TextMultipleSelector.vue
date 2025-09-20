<template>
    <div class="form-control space-y-4">
        <label class="label" v-if="props.label">
            <span class="label-text text-base font-semibold">{{ props.label }}</span>
        </label>

        <!-- Search Input with Icon -->
        <div class="relative">
            <input
                class="input input-bordered w-full pl-10 pr-4 h-12 text-base focus:input-primary transition-colors duration-200"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder || 'Search items...'"
                autocomplete="off"
                v-model="searchString"
                :disabled="isLoading"
                aria-describedby="search-help"
            />
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
                <div v-else class="loading loading-spinner loading-sm text-primary"></div>
            </div>
            <div v-if="searchString" class="absolute inset-y-0 right-3 flex items-center">
                <button @click="searchString = ''; availableItems = []"
                        class="btn btn-circle btn-ghost btn-xs"
                        type="button"
                        aria-label="Clear search">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        <div id="search-help" class="text-xs text-base-content/60 mt-1">
            Start typing to search for items...
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Available Items -->
        <div v-if="availableItems.data && availableItems.data.length > 0" class="card bg-base-100 shadow-md border border-base-200">
            <div class="card-header bg-primary text-primary-content px-4 py-3">
                <h3 class="card-title text-sm font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Available Items ({{ availableItems.data.length }})
                </h3>
            </div>
            <div class="card-body p-3 max-h-64 overflow-y-auto">
                <div class="space-y-2">
                    <div v-for="(item, index) in availableItems.data"
                         :key="item.id"
                         @click="addItem(item)"
                         class="flex justify-between items-center p-3 rounded-lg border border-base-200 hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer group"
                         :class="{ 'opacity-50 cursor-not-allowed': isItemSelected(item) }"
                         @keydown.enter="addItem(item)"
                         @keydown.space.prevent="addItem(item)"
                         tabindex="0"
                         role="button"
                         :aria-label="`Add ${item[props.displayKey]} to selection`">
                        <span class="text-sm font-medium text-base-content group-hover:text-primary transition-colors">
                            {{ item[props.displayKey] }}
                        </span>
                        <div class="btn btn-circle btn-xs"
                             :class="isItemSelected(item) ? 'btn-disabled' : 'btn-primary group-hover:btn-secondary'">
                            <svg v-if="!isItemSelected(item)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State for Search -->
        <div v-else-if="searchString && !isLoading && availableItems.data && availableItems.data.length === 0"
             class="text-center py-8 text-base-content/60">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-sm font-medium">No items found</p>
            <p class="text-xs mt-1">Try searching with different keywords</p>
        </div>

        <!-- Selected Items -->
        <div v-if="selectedItem.length > 0" class="card bg-base-100 shadow-md border border-base-200">
            <div class="card-header bg-secondary text-secondary-content px-4 py-3">
                <h3 class="card-title text-sm font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Selected Items ({{ selectedItem.length }}){{ props.singleMode ? ' - Single Mode' : '' }}
                </h3>
            </div>
            <div class="card-body p-3">
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    <div v-for="(item, index) in selectedItem"
                         :key="item.id"
                         class="flex justify-between items-center p-3 rounded-lg border border-base-200 bg-base-50 hover:bg-base-100 transition-all duration-200 group">
                        <span class="text-sm font-medium text-base-content flex-1 min-w-0 pr-3">
                            <span class="truncate block">{{ item[props.displayKey] }}</span>
                        </span>
                        <button
                            @click="removeItem(index)"
                            class="btn btn-circle btn-xs btn-error hover:btn-error/80 opacity-70 group-hover:opacity-100 transition-opacity"
                            @keydown.enter="removeItem(index)"
                            @keydown.space.prevent="removeItem(index)"
                            :aria-label="`Remove ${item[props.displayKey]} from selection`"
                            type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State for Selected Items -->
        <div v-else-if="!selectedItem.length && !searchString"
             class="text-center py-6 text-base-content/60 border-2 border-dashed border-base-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p class="text-sm font-medium">No items selected</p>
            <p class="text-xs mt-1">Search and select items to get started</p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { watch, onMounted, defineEmits, ref, computed, nextTick } from "vue";
import { usePage } from "@inertiajs/vue3";

let errorMessage = ref(null);
let searchString = ref("");
let availableItems = ref([]);
let selectedItem = ref([]);
let isLoading = ref(false);
let searchTimeout = ref(null);

// Computed property to check if an item is already selected
const isItemSelected = computed(() => {
    return (item) => {
        return selectedItem.value.some(selected => selected.id === item.id);
    };
});

watch(
    () => usePage().props?.errors,
    (v) => {
        if (usePage().props.errors[props.name]) {
            errorMessage.value = usePage().props.errors[props.name];
        } else {
            errorMessage.value = null;
        }
    }
);

// Watch for search string changes with debouncing
watch(searchString, (newValue) => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    if (newValue.trim()) {
        searchTimeout.value = setTimeout(() => {
            searchImage();
        }, 300); // 300ms debounce
    } else {
        availableItems.value = [];
    }
});

const props = defineProps({
    label: { type: String, default: "" },
    name: { type: String, default: "" },
    id: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    model: { type: String, default: "" },
    columns: { type: Object, default: null },
    endpoint: { type: String, default: "" },
    loadData: { type: Object, default: null },
    singleMode: { type: Boolean, default: false },
    displayKey: { type: String, default: "name" },
});

const emit = defineEmits(["update:modelValue"]);

const update = (event) => {
    emit("update:modelValue", event.target.value);
};

const searchImage = async () => {
    if (!searchString.value.trim()) {
        availableItems.value = [];
        return;
    }

    isLoading.value = true;
    errorMessage.value = null;

    try {
        const response = await axios.post(props.endpoint, {
            search: searchString.value,
            model: props.model,
            columns: props.columns,
        });

        availableItems.value = response.data;
    } catch (error) {
        console.error('Search error:', error);
        availableItems.value = [];

        if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0];
            errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError;
        } else {
            errorMessage.value = 'An error occurred while searching. Please try again.';
        }
    } finally {
        isLoading.value = false;
    }
};

const addItem = (item) => {
    // Prevent adding if already selected
    if (isItemSelected.value(item)) {
        return;
    }

    if (props.singleMode) {
        selectedItem.value = [];
    }

    if (!Array.isArray(selectedItem.value)) {
        selectedItem.value = [];
    }

    selectedItem.value.push({
        id: item.id,
        [props.displayKey]: item[props.displayKey],
    });

    // Clear search results after adding
    availableItems.value = [];
    searchString.value = "";

    emit("update:modelValue", selectedItem.value);
};

const removeItem = (index) => {
    selectedItem.value.splice(index, 1);
    emit("update:modelValue", selectedItem.value);
};

onMounted(() => {
    if (props.loadData) {
        if (props.singleMode) {
            selectedItem.value = Array.isArray(props.loadData) ? props.loadData : [props.loadData];
        } else {
            selectedItem.value = Array.isArray(props.loadData) ? props.loadData : [];
        }
        emit("update:modelValue", selectedItem.value);
    }
});
</script>
