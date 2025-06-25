<template>
    <div class="form-control w-full">
        <!-- Label -->
        <label :for="id" class="label" v-if="label || $slots.label">
            <slot name="label">
                <span class="label-text font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ label }}
                    <div v-if="required" class="badge badge-error badge-sm">Required</div>
                </span>
            </slot>
        </label>

        <!-- Main Input Container -->
        <div class="relative">
            <!-- DateTime Input -->
            <div class="relative">
                <input
                    :id="id"
                    :name="name"
                    type="datetime-local"
                    :class="[
                        'input input-bordered w-full pr-20 font-mono text-sm',
                        inputClass,
                        {
                            'input-error border-error focus:border-error': $page.props.errors?.[name] || hasClientValidationError,
                            'input-success border-success': isValid && inputValue,
                            'focus:border-primary': !($page.props.errors?.[name] || hasClientValidationError)
                        }
                    ]"
                    v-model="inputValue"
                    :required="required"
                    :min="min"
                    :max="max"
                    :placeholder="placeholder || 'Select date and time...'"
                    @blur="onBlur"
                    @focus="onFocus"
                    @input="onInput" />

                <!-- Quick Action Buttons -->
                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <!-- Now Button -->
                    <div class="tooltip tooltip-left" data-tip="Set to current time">
                        <button type="button"
                                @click="setToNow"
                                class="btn btn-xs btn-ghost hover:btn-primary text-primary hover:text-primary-content">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Clear Button -->
                    <div class="tooltip tooltip-left" data-tip="Clear date">
                        <button type="button"
                                @click="clearValue"
                                v-if="inputValue"
                                class="btn btn-xs btn-ghost hover:btn-error text-error hover:text-error-content">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quick Preset Options -->
            <div v-if="showPresets" class="mt-2 flex flex-wrap gap-1">
                <button type="button"
                        v-for="preset in presetOptions"
                        :key="preset.label"
                        @click="applyPreset(preset)"
                        class="btn btn-xs btn-outline btn-primary">
                    {{ preset.label }}
                </button>
            </div>
        </div>

        <!-- Display Information -->
        <div v-if="inputValue && !($page.props.errors?.[name] || hasClientValidationError)" class="mt-2 space-y-1">
            <!-- Formatted Display -->
            <div class="bg-base-200 rounded-lg p-3 border border-base-300">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <!-- Local Time -->
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="text-base-content/70">Local:</span>
                        <span class="font-medium">{{ formattedLocalTime }}</span>
                    </div>

                    <!-- UTC Time -->
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        <span class="text-base-content/70">UTC:</span>
                        <span class="font-medium">{{ formattedUtcTime }}</span>
                    </div>

                    <!-- Relative Time -->
                    <div class="flex items-center gap-2 sm:col-span-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-base-content/70">Relative:</span>
                        <span class="font-medium" :class="relativeTimeClass">{{ relativeTime }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Validation Error -->
        <div v-if="$page.props.errors?.[name] || hasClientValidationError" class="label">
            <span class="label-text-alt text-error flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ $page.props.errors?.[name] || clientValidationError }}
            </span>
        </div>

        <!-- Help Text -->
        <div v-if="helpText && !($page.props.errors?.[name] || hasClientValidationError)" class="label">
            <span class="label-text-alt text-base-content/60 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ helpText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface TimestampProps {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    inputClass?: string;
    required?: boolean;
    min?: string;
    max?: string;
    helpText?: string;
    showPresets?: boolean;
}

const props = withDefaults(defineProps<TimestampProps>(), {
    label: '',
    placeholder: '',
    inputClass: '',
    required: false,
    helpText: '',
    showPresets: true
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
    'focus': [event: FocusEvent];
}>();

const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

// Client-side validation
const clientValidationError = computed(() => {
    if (props.required && !inputValue.value) {
        return `${props.label} is required`;
    }

    if (inputValue.value) {
        const date = new Date(inputValue.value);

        if (isNaN(date.getTime())) {
            return 'Invalid date format';
        }

        if (props.min && inputValue.value < props.min) {
            return 'Date must be after minimum date';
        }

        if (props.max && inputValue.value > props.max) {
            return 'Date must be before maximum date';
        }
    }

    return null;
});

const hasClientValidationError = computed(() => !!clientValidationError.value);

const isValid = computed(() => {
    return inputValue.value && !clientValidationError.value;
});

// Preset options for quick selection
const presetOptions = computed(() => [
    {
        label: 'Now',
        getValue: () => new Date().toISOString().slice(0, 16)
    },
    {
        label: 'Tomorrow',
        getValue: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            return tomorrow.toISOString().slice(0, 16);
        }
    },
    {
        label: 'Next Week',
        getValue: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            nextWeek.setHours(9, 0, 0, 0);
            return nextWeek.toISOString().slice(0, 16);
        }
    },
    {
        label: 'Next Month',
        getValue: () => {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(9, 0, 0, 0);
            return nextMonth.toISOString().slice(0, 16);
        }
    }
]);

// Formatted time displays
const formattedLocalTime = computed(() => {
    if (!inputValue.value) return '';
    const date = new Date(inputValue.value);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
});

const formattedUtcTime = computed(() => {
    if (!inputValue.value) return '';
    const date = new Date(inputValue.value);
    return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
});

const relativeTime = computed(() => {
    if (!inputValue.value) return '';
    const date = new Date(inputValue.value);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (Math.abs(diffMins) < 1) return 'Just now';
    if (Math.abs(diffMins) < 60) return `${diffMins > 0 ? 'In' : ''} ${Math.abs(diffMins)} minute${Math.abs(diffMins) !== 1 ? 's' : ''} ${diffMins < 0 ? 'ago' : ''}`;
    if (Math.abs(diffHours) < 24) return `${diffHours > 0 ? 'In' : ''} ${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours < 0 ? 'ago' : ''}`;
    return `${diffDays > 0 ? 'In' : ''} ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays < 0 ? 'ago' : ''}`;
});

const relativeTimeClass = computed(() => {
    if (!inputValue.value) return '';
    const date = new Date(inputValue.value);
    const now = new Date();
    const isPast = date < now;
    return isPast ? 'text-warning' : 'text-success';
});

// Methods
const onFocus = (event: FocusEvent) => {
    emit('focus', event);
};

const onBlur = (event: FocusEvent) => {
    emit('blur', event);
};

const onInput = () => {
    // Validation happens automatically via computed properties
};

const setToNow = () => {
    const now = new Date();
    inputValue.value = now.toISOString().slice(0, 16);
};

const clearValue = () => {
    inputValue.value = '';
};

const applyPreset = (preset: any) => {
    inputValue.value = preset.getValue();
};
</script>

<style scoped>
/* Custom focus styles for datetime input */
input[type="datetime-local"]:focus {
    outline: none;
}

/* Improve datetime input appearance */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
}

/* Custom styling for validation states */
.input-success {
    border-color: oklch(var(--su));
}

.input-success:focus {
    border-color: oklch(var(--su));
    box-shadow: 0 0 0 2px oklch(var(--su) / 0.2);
}
</style>
