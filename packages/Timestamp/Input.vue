<template>
    <div class="form-control">
      <label :for="id" class="label">
        <span :class="labelClass">{{ label }}</span>
      </label>

      <input
        :id="id"
        :name="name"
        type="datetime-local"
        v-model="inputValue"
        class="hidden"
      />

      <div class="relative">
        <button
          type="button"
          @click="togglePicker"
          :class="[
            inputClass,
            'flex items-center justify-between w-full px-4 py-2',
            { 'error': errorMessage }
          ]"
        >
          <span class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-gray-500" />
            <span class="text-gray-700">
              {{ displayValue || placeholder || 'Select date and time' }}
            </span>
          </span>
          <ChevronDown
            class="w-5 h-5 text-gray-500 transition-transform"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>

        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg"
          v-click-outside="closePicker"
        >
          <div class="p-4 space-y-4">
            <!-- Year and Month Selection -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <button
                  @click="() => showYearSelect = !showYearSelect"
                  class="px-3 py-1 text-sm font-semibold hover:bg-gray-100 rounded-full transition-colors"
                >
                  {{ currentYear }}
                  <ChevronDown class="w-4 h-4 inline-block ml-1" :class="{ 'rotate-180': showYearSelect }" />
                </button>
                <button
                  class="text-gray-700 font-medium hover:bg-gray-100 px-3 py-1 rounded-full"
                  @click="() => showMonthSelect = !showMonthSelect"
                >
                  {{ currentMonthName }}
                  <ChevronDown class="w-4 h-4 inline-block ml-1" :class="{ 'rotate-180': showMonthSelect }" />
                </button>
              </div>
              <div class="flex gap-1">
                <button
                  @click="previousMonth"
                  class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft class="w-4 h-4" />
                </button>
                <button
                  @click="nextMonth"
                  class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Year Selection Dropdown -->
            <div v-if="showYearSelect" class="absolute top-16 left-4 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div class="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
                <button
                  v-for="year in yearRange"
                  :key="year"
                  @click="selectYear(year)"
                  class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
                  :class="{ 'bg-primary/10 text-primary font-semibold': year === currentYear }"
                >
                  {{ year }}
                </button>
              </div>
            </div>

            <!-- Month Selection Dropdown -->
            <div v-if="showMonthSelect" class="absolute top-16 left-24 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div class="grid grid-cols-3 gap-1">
                <button
                  v-for="(month, index) in monthNames"
                  :key="month"
                  @click="selectMonth(index)"
                  class="px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
                  :class="{ 'bg-primary/10 text-primary font-semibold': index === currentDate.getMonth() }"
                >
                  {{ month }}
                </button>
              </div>
            </div>

            <!-- Week Days Header -->
            <div class="grid grid-cols-7 mb-1">
              <span
                v-for="day in weekDays"
                :key="day"
                class="text-center text-sm text-gray-500 font-medium"
              >
                {{ day }}
              </span>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="date in calendarDates"
                :key="date.toISOString()"
                @click="selectDate(date)"
                class="p-2 text-sm rounded-full hover:bg-gray-100 transition-colors relative group"
                :class="{
                  'bg-primary/10 text-primary font-semibold': isSelectedDate(date),
                  'text-gray-400': !isSameMonth(date),
                  'text-gray-900': isSameMonth(date)
                }"
              >
                {{ date.getDate() }}
                <div
                  v-if="isToday(date)"
                  class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                ></div>
              </button>
            </div>

            <!-- Time Selection -->
            <div class="flex items-center justify-center gap-4 pt-4 border-t">
              <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <select
                  v-model="selectedHours"
                  class="w-16 p-1 bg-white border rounded shadow-sm focus:ring-1 focus:ring-primary"
                  @change="updateTime"
                >
                  <option v-for="hour in 24" :key="hour" :value="hour - 1">
                    {{ String(hour - 1).padStart(2, '0') }}
                  </option>
                </select>
                <span class="text-gray-500 font-medium">:</span>
                <select
                  v-model="selectedMinutes"
                  class="w-16 p-1 bg-white border rounded shadow-sm focus:ring-1 focus:ring-primary"
                  @change="updateTime"
                >
                  <option v-for="minute in minuteOptions" :key="minute" :value="minute">
                    {{ String(minute).padStart(2, '0') }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Quick Selection -->
            <div class="flex flex-wrap gap-2 pt-3 border-t">
              <button
                v-for="preset in timePresets"
                :key="preset.label"
                @click="selectPreset(preset.value)"
                class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform opacity-0"
      >
        <span
          v-if="errorMessage"
          :class="messageClass"
          role="alert"
          aria-live="polite"
        >
          <strong>{{ errorMessage }}</strong>
        </span>
      </Transition>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { usePage } from '@inertiajs/vue3';
  import {
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight
  } from 'lucide-vue-next';
  import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday as isDateToday } from 'date-fns';

  interface InputProps {
    label: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    messageClass?: string;
    labelClass?: string;
    inputClass?: string;
    required?: boolean;
    min?: string;
    max?: string;
  }

  const props = withDefaults(defineProps<InputProps>(), {
    placeholder: '',
    messageClass: 'text-red-500 text-sm mt-1',
    labelClass: 'block text-lg font-bold mb-2',
    inputClass: 'input input-primary input-bordered w-full',
    required: false
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
  }>();

  // State
  const isOpen = ref(false);
  const showYearSelect = ref(false);
  const showMonthSelect = ref(false);
  const currentDate = ref(new Date());
  const selectedDate = ref<Date | null>(null);
  const selectedHours = ref(0);
  const selectedMinutes = ref(0);
  const errorMessage = ref<string | null>(null);
  const page = usePage();

  // Time presets
  const timePresets = [
    { label: 'Now', value: new Date() },
    { label: 'Start of Day', value: new Date().setHours(0, 0, 0, 0) },
    { label: 'End of Day', value: new Date().setHours(23, 59, 59, 999) },
    { label: 'Tomorrow', value: new Date().setDate(new Date().getDate() + 1) },
  ];

  // Constants
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Computed values
  const yearRange = computed(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  });

  const currentMonthName = computed(() => {
    return format(currentDate.value, 'MMMM');
  });

  const currentYear = computed(() => {
    return currentDate.value.getFullYear();
  });

  const calendarDates = computed(() => {
    const start = startOfMonth(currentDate.value);
    const end = endOfMonth(currentDate.value);
    return eachDayOfInterval({ start, end });
  });

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const displayValue = computed(() => {
    if (!selectedDate.value) return '';
    return format(selectedDate.value, 'MMM d, yyyy HH:mm');
  });

  // Methods
  const togglePicker = () => {
    isOpen.value = !isOpen.value;
    showYearSelect.value = false;
    showMonthSelect.value = false;
  };

  const closePicker = () => {
    isOpen.value = false;
    showYearSelect.value = false;
    showMonthSelect.value = false;
  };

  const selectYear = (year: number) => {
    currentDate.value = new Date(year, currentDate.value.getMonth(), 1);
    showYearSelect.value = false;
  };

  const selectMonth = (month: number) => {
    currentDate.value = new Date(currentDate.value.getFullYear(), month, 1);
    showMonthSelect.value = false;
  };

  const previousMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1
    );
  };

  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1
    );
  };

  const selectDate = (date: Date) => {
    selectedDate.value = new Date(date);
    selectedDate.value.setHours(selectedHours.value);
    selectedDate.value.setMinutes(selectedMinutes.value);
    updateValue();
  };

  const updateTime = () => {
    if (selectedDate.value) {
      selectedDate.value.setHours(selectedHours.value);
      selectedDate.value.setMinutes(selectedMinutes.value);
      updateValue();
    }
  };

  const selectPreset = (timestamp: number) => {
    const date = new Date(timestamp);
    selectedDate.value = date;
    selectedHours.value = date.getHours();
    selectedMinutes.value = date.getMinutes();
    updateValue();
    closePicker();
  };

  const updateValue = () => {
    if (selectedDate.value) {
      inputValue.value = format(selectedDate.value, "yyyy-MM-dd'T'HH:mm");
      validateInput();
    }
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate.value && isSameDay(date, selectedDate.value);
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.value.getMonth();
  };

  const isToday = (date: Date) => {
    return isDateToday(date);
  };

  const validateInput = () => {
    errorMessage.value = null;
    if (props.required && !inputValue.value) {
      errorMessage.value = `${props.label} is required`;
      return;
    }
    if (props.min && inputValue.value < props.min) {
      errorMessage.value = `Date must be after ${format(new Date(props.min), 'MMM d, yyyy HH:mm')}`;
      return;
    }
    if (props.max && inputValue.value > props.max) {
      errorMessage.value = `Date must be before ${format(new Date(props.max), 'MMM d, yyyy HH:mm')}`;
      return;
    }
  };

  // Watch for Inertia errors
  watch(
    () => page.props.errors,
    (newErrors) => {
      if (newErrors && newErrors[props.name]) {
        errorMessage.value = newErrors[props.name];
      } else {
        errorMessage.value = null;
      }
    },
    { deep: true }
  );

  // Initialize from prop value
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        const date = new Date(newValue);
        selectedDate.value = date;
        selectedHours.value = date.getHours();
        selectedMinutes.value = date.getMinutes();
        currentDate.value = date;
      }
    },
    { immediate: true }
  );
  </script>

  <style scoped>
   @reference "tailwindcss";
  .form-control {
    @apply relative mb-4;
  }

  .error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500;
  }
  </style>
