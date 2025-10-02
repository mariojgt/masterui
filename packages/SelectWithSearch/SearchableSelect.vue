<template>
    <div class="form-control w-full" ref="containerRef">
        <!-- Label -->
        <label v-if="label || $slots.label" class="label">
            <slot name="label">
                <span class="label-text font-semibold">{{ label }}</span>
            </slot>
        </label>

        <!-- Dropdown Container -->
        <div class="dropdown w-full" :class="{ 'dropdown-open': isOpen }">
            <!-- Search Input -->
            <div class="relative">
                <input
                    :id="id"
                    :name="name"
                    type="text"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    v-model="searchQuery"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keydown="handleKeyDown"
                    class="input input-bordered w-full pr-10"
                    :class="{
                        'input-disabled': disabled,
                        'border-primary': isOpen,
                        'input-error': hasError
                    }"
                    autocomplete="off"
                />

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        class="w-4 h-4 transition-transform"
                        :class="{ 'rotate-180': isOpen }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                <!-- Loading Spinner -->
                <div v-if="loading" class="absolute inset-y-0 right-8 flex items-center pr-3">
                    <span class="loading loading-spinner loading-xs"></span>
                </div>
            </div>

            <!-- Dropdown Menu -->
            <div
                v-show="isOpen"
                class="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-full max-h-60 overflow-auto border border-base-300 mt-1"
                style="box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);"
            >
                <!-- No Results -->
                <div v-if="filteredOptions.length === 0 && searchQuery" class="px-4 py-3 text-sm text-base-content/60 text-center">
                    <div class="flex flex-col items-center space-y-2">
                        <svg class="w-8 h-8 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>No results found for "{{ searchQuery }}"</span>
                    </div>
                </div>

                <!-- Show all options message -->
                <div v-if="filteredOptions.length === optionsArray.length && searchQuery.length >= searchThreshold" class="px-4 py-2 text-xs text-base-content/50 border-b border-base-300 mb-2">
                    Showing all {{ filteredOptions.length }} options
                </div>

                <!-- Options -->
                <li
                    v-for="(option, index) in filteredOptions"
                    :key="option.value"
                    @mousedown.prevent="selectOption(option)"
                    @mouseenter="highlightedIndex = index"
                    class="cursor-pointer transition-colors duration-150"
                    :class="{
                        'bg-primary text-primary-content': index === highlightedIndex,
                        'bg-primary/20 border-l-4 border-primary': option.value === modelValue && index !== highlightedIndex
                    }"
                >
                    <div class="flex items-center justify-between px-3 py-2 rounded-lg">
                        <div
                            class="truncate flex-1 text-sm"
                            v-if="renderHtml"
                            v-html="option.label"
                        ></div>
                        <span
                            class="truncate flex-1 text-sm"
                            v-else
                            v-text="option.label"
                        ></span>
                        <span v-if="option.value === modelValue" class="ml-2 flex-shrink-0">
                            <svg class="w-4 h-4 text-primary" :class="{ 'text-primary-content': index === highlightedIndex }" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </li>

                <!-- Add New Option (if enabled) -->
                <li v-if="allowCustom && searchQuery && !optionExists(searchQuery)"
                    @mousedown.prevent="createCustomOption"
                    @mouseenter="highlightedIndex = filteredOptions.length"
                    class="cursor-pointer border-t border-base-300 mt-2 pt-2 transition-colors duration-150"
                    :class="{
                        'bg-success text-success-content': highlightedIndex === filteredOptions.length
                    }"
                >
                    <a class="px-3 py-2 rounded-lg flex items-center">
                        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span class="text-sm">Add "{{ searchQuery }}"</span>
                    </a>
                </li>
            </div>
        </div>

        <!-- Helper Text -->
        <label v-if="helperText || hasError" class="label">
            <span class="label-text-alt" :class="{ 'text-error': hasError }">
                {{ hasError ? errorMessage : helperText }}
            </span>
        </label>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    options: {
        type: [Object, Array],
        default: () => ({})
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search or select...'
    },
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    allowCustom: {
        type: Boolean,
        default: false
    },
    helperText: {
        type: String,
        default: ''
    },
    errorMessage: {
        type: String,
        default: ''
    },
    hasError: {
        type: Boolean,
        default: false
    },
    searchThreshold: {
        type: Number,
        default: 1
    },
    // New prop to control HTML rendering
    renderHtml: {
        type: Boolean,
        default: true
    },
    // New prop to disable sorting
    sortBy: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue', 'search', 'custom-option']);

// Template refs
const containerRef = ref(null);

// Component state
const isOpen = ref(false);
const searchQuery = ref('');
const highlightedIndex = ref(-1);
const blurTimeout = ref(null);

// Methods - Define these first to avoid hoisting issues
const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
};

// Get text for searching (always strip HTML for better search experience)
const getSearchableText = (label) => {
    return stripHtmlTags(label);
};

// Get text for display in input field (always strip HTML for clean input display)
const getDisplayText = (label) => {
    return stripHtmlTags(label);
};

// Convert options object to array format
const optionsArray = computed(() => {
    // If options is already an array, use it directly (preserves order)
    if (Array.isArray(props.options)) {
        return props.options
            .filter(option =>
                option &&
                typeof option === 'object' &&
                option.value !== undefined &&
                option.value !== '' &&
                option.label !== undefined
            )
            .map(option => ({
                value: String(option.value),
                label: String(option.label)
            }));
    }

    // Otherwise convert object to array (legacy support)
    return Object.entries(props.options)
        .map(([value, label]) => ({
            value: String(value),
            label: String(label)
        }))
        .filter(option => option.value !== ''); // Filter out empty options
});

// Get currently selected option
const selectedOption = computed(() => {
    return optionsArray.value.find(option => option.value == props.modelValue);
});

// Filter options based on search query
const filteredOptions = computed(() => {
    if (!searchQuery.value || searchQuery.value.length < props.searchThreshold) {
        return optionsArray.value;
    }

    const query = searchQuery.value.toLowerCase();
    return optionsArray.value.filter(option =>
        getSearchableText(option.label).toLowerCase().includes(query) ||
        option.value.toString().toLowerCase().includes(query)
    );
});

// Initialize search query with selected option label
watch(() => props.modelValue, (newValue) => {
    if (newValue && !isOpen.value) {
        const option = optionsArray.value.find(opt => opt.value == newValue);
        searchQuery.value = option ? getDisplayText(option.label) : '';
    } else if (!newValue && !isOpen.value) {
        // Clear the search query if no value is selected
        searchQuery.value = '';
    }
}, { immediate: true });

// Reset highlighted index when filtered options change
watch(filteredOptions, () => {
    highlightedIndex.value = -1;
});

const handleFocus = () => {
    if (props.disabled) return;

    isOpen.value = true;
    searchQuery.value = ''; // Clear to show all options
    highlightedIndex.value = -1;

    if (blurTimeout.value) {
        clearTimeout(blurTimeout.value);
        blurTimeout.value = null;
    }
};

const handleBlur = () => {
    blurTimeout.value = setTimeout(() => {
        isOpen.value = false;

        // Restore selected option label if no selection was made
        const option = optionsArray.value.find(opt => opt.value == props.modelValue);
        searchQuery.value = option ? getDisplayText(option.label) : '';
    }, 150);
};

const handleKeyDown = (event) => {
    if (props.disabled) return;

    const maxIndex = filteredOptions.value.length - 1 + (props.allowCustom && searchQuery.value && !optionExists(searchQuery.value) ? 1 : 0);

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (!isOpen.value) {
                isOpen.value = true;
            } else {
                highlightedIndex.value = Math.min(highlightedIndex.value + 1, maxIndex);
            }
            break;

        case 'ArrowUp':
            event.preventDefault();
            if (isOpen.value) {
                highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
            }
            break;

        case 'Enter':
            event.preventDefault();
            if (isOpen.value) {
                if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
                    selectOption(filteredOptions.value[highlightedIndex.value]);
                } else if (highlightedIndex.value === filteredOptions.value.length && props.allowCustom && searchQuery.value && !optionExists(searchQuery.value)) {
                    createCustomOption();
                }
            }
            break;

        case 'Escape':
            event.preventDefault();
            isOpen.value = false;
            const option = optionsArray.value.find(opt => opt.value == props.modelValue);
            searchQuery.value = option ? getDisplayText(option.label) : '';
            break;
    }
};

const selectOption = (option) => {
    if (props.disabled) return;

    emit('update:modelValue', option.value);
    searchQuery.value = getDisplayText(option.label);
    isOpen.value = false;
    highlightedIndex.value = -1;

    if (blurTimeout.value) {
        clearTimeout(blurTimeout.value);
        blurTimeout.value = null;
    }
};

const optionExists = (query) => {
    return optionsArray.value.some(option =>
        getSearchableText(option.label).toLowerCase() === query.toLowerCase()
    );
};

const createCustomOption = () => {
    if (props.disabled) return;

    emit('custom-option', searchQuery.value);
    isOpen.value = false;
};

// Handle clicks outside to close dropdown
const handleClickOutside = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
        isOpen.value = false;
        const option = optionsArray.value.find(opt => opt.value == props.modelValue);
        searchQuery.value = option ? getDisplayText(option.label) : '';
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (blurTimeout.value) {
        clearTimeout(blurTimeout.value);
    }
});
</script>
