<template>
  <div class="form-control w-full">
    <!-- Label -->
    <label v-if="label" class="label">
      <span class="label-text font-semibold">{{ label }}</span>
      <span v-if="required" class="label-text-alt text-error">*</span>
    </label>

    <!-- Date and Time Inputs -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Date Input -->
      <div class="relative">
        <input
          :id="id + '_date'"
          type="date"
          :value="dateValue"
          @input="handleDateInput"
          @change="handleDateChange"
          :required="required"
          :class="[
            'input input-bordered w-full',
            errorMessage ? 'input-error' : 'focus:input-primary'
          ]"
        />
        <label class="text-xs text-gray-500 mt-1">Date</label>
      </div>

      <!-- Time Input -->
      <div class="relative">
        <input
          :id="id + '_time'"
          type="time"
          :value="timeValue"
          @input="handleTimeInput"
          @change="handleTimeChange"
          :class="[
            'input input-bordered w-full',
            errorMessage ? 'input-error' : 'focus:input-primary'
          ]"
          step="900"
        />
        <label class="text-xs text-gray-500 mt-1">Time</label>
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <div class="flex gap-2 mt-3 flex-wrap">
      <button
        type="button"
        @click="setToNow"
        class="btn btn-xs btn-outline"
      >
        📅 Now
      </button>
      <button
        type="button"
        @click="setToday9AM"
        class="btn btn-xs btn-outline"
      >
        🌅 Today 9AM
      </button>
      <button
        type="button"
        @click="setToday5PM"
        class="btn btn-xs btn-outline"
      >
        🌆 Today 5PM
      </button>
      <button
        type="button"
        @click="setTomorrow9AM"
        class="btn btn-xs btn-outline"
      >
        ➡️ Tomorrow 9AM
      </button>
      <button
        type="button"
        @click="clearDateTime"
        class="btn btn-xs btn-outline btn-error"
        v-if="modelValue"
      >
        ❌ Clear
      </button>
    </div>

    <!-- Display Current Selection -->
    <div v-if="modelValue" class="mt-2 p-2 bg-base-200 rounded text-sm">
      <strong>Selected:</strong> {{ formatDisplayValue }}
    </div>

    <!-- Error Message -->
    <label v-if="errorMessage" class="label">
      <span class="label-text-alt text-error">{{ errorMessage }}</span>
    </label>

    <!-- Hidden Input for Form Submission -->
    <input
      :id="id"
      :name="name"
      type="datetime-local"
      :value="modelValue"
      class="hidden"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'

interface Props {
  label?: string
  name: string
  id: string
  modelValue: string
  required?: boolean
  min?: string
  max?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const errorMessage = ref('')
const page = usePage()

// Computed values for separate date and time
const dateValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
})

const timeValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return ''

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  } catch {
    return ''
  }
})

const formatDisplayValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return ''

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    return date.toLocaleDateString('en-US', options)
  } catch {
    return ''
  }
})

// Internal state to track current date and time
const currentDate = ref('')
const currentTime = ref('')

// Methods to handle input changes
const handleDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentDate.value = target.value
  updateDateTime()
}

const handleDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentDate.value = target.value
  updateDateTime()
}

const handleTimeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentTime.value = target.value
  updateDateTime()
}

const handleTimeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentTime.value = target.value
  updateDateTime()
}

const updateDateTime = () => {
  if (currentDate.value && currentTime.value) {
    const dateTimeString = `${currentDate.value}T${currentTime.value}`
    emit('update:modelValue', dateTimeString)
    validateInput(dateTimeString)
  } else if (!currentDate.value && !currentTime.value) {
    emit('update:modelValue', '')
    errorMessage.value = ''
  }
}

// Quick action methods
const setToNow = () => {
  const now = new Date()
  setDateTime(now)
}

const setToday9AM = () => {
  const today = new Date()
  today.setHours(9, 0, 0, 0)
  setDateTime(today)
}

const setToday5PM = () => {
  const today = new Date()
  today.setHours(17, 0, 0, 0)
  setDateTime(today)
}

const setTomorrow9AM = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  setDateTime(tomorrow)
}

const setDateTime = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  currentDate.value = `${year}-${month}-${day}`
  currentTime.value = `${hours}:${minutes}`

  const dateTimeString = `${currentDate.value}T${currentTime.value}`
  emit('update:modelValue', dateTimeString)
}

const clearDateTime = () => {
  currentDate.value = ''
  currentTime.value = ''
  emit('update:modelValue', '')
  errorMessage.value = ''
}

const validateInput = (value: string) => {
  errorMessage.value = ''

  if (props.required && !value) {
    errorMessage.value = `${props.label || 'This field'} is required`
    return
  }

  if (value && props.min && value < props.min) {
    const minDate = new Date(props.min)
    errorMessage.value = `Date must be after ${minDate.toLocaleDateString()}`
    return
  }

  if (value && props.max && value > props.max) {
    const maxDate = new Date(props.max)
    errorMessage.value = `Date must be before ${maxDate.toLocaleDateString()}`
    return
  }
}

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    try {
      const date = new Date(newValue)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        currentDate.value = `${year}-${month}-${day}`
        currentTime.value = `${hours}:${minutes}`
      }
    } catch {
      currentDate.value = ''
      currentTime.value = ''
    }
  } else {
    currentDate.value = ''
    currentTime.value = ''
  }
}, { immediate: true })

// Watch for Inertia errors
watch(
  () => page.props.errors,
  (newErrors) => {
    if (newErrors && newErrors[props.name]) {
      errorMessage.value = newErrors[props.name]
    } else if (!newErrors) {
      errorMessage.value = ''
    }
  },
  { deep: true, immediate: true }
)
</script>
