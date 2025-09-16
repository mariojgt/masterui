<template>
  <div class="form-control w-full">
    <!-- Label -->
    <label v-if="label" class="label">
      <span class="label-text font-semibold">{{ label }}</span>
      <span v-if="required" class="label-text-alt text-error">*</span>
    </label>

    <!-- Timezone Settings Toggle -->
    <div class="mb-3">
      <button
        type="button"
        @click="showTimezoneSettings = !showTimezoneSettings"
        class="btn btn-sm btn-outline btn-ghost flex items-center gap-2"
      >
        <span class="text-xs">⚙️ Timezone Settings</span>
        <span class="text-xs">{{ showTimezoneSettings ? '▼' : '▶️' }}</span>
        <span class="badge badge-xs badge-primary">{{ selectedTimezone }}</span>
      </button>
    </div>

    <!-- Timezone Selector (Collapsible) -->
    <div v-show="showTimezoneSettings" class="mb-4 bg-base-100 p-3 rounded-lg border border-base-300">
      <label class="label">
        <span class="label-text font-semibold">Timezone</span>
      </label>
      <select
        v-model="selectedTimezone"
        @change="handleTimezoneChange"
        class="select select-bordered w-full"
      >
        <option value="UTC">UTC+0 (Coordinated Universal Time)</option>
        <option :value="browserTimezone" v-if="browserTimezone && browserTimezone !== 'UTC'">
          📍 My Timezone ({{ browserTimezone }})
        </option>
        <option value="America/New_York">UTC-5/-4 (Eastern Time)</option>
        <option value="America/Chicago">UTC-6/-5 (Central Time)</option>
        <option value="America/Denver">UTC-7/-6 (Mountain Time)</option>
        <option value="America/Los_Angeles">UTC-8/-7 (Pacific Time)</option>
        <option value="Europe/London">UTC+0/+1 (London)</option>
        <option value="Europe/Paris">UTC+1/+2 (Paris)</option>
        <option value="Europe/Berlin">UTC+1/+2 (Berlin)</option>
        <option value="Europe/Rome">UTC+1/+2 (Rome)</option>
        <option value="Europe/Madrid">UTC+1/+2 (Madrid)</option>
        <option value="Asia/Tokyo">UTC+9 (Tokyo)</option>
        <option value="Asia/Shanghai">UTC+8 (Shanghai)</option>
        <option value="Asia/Dubai">UTC+4 (Dubai)</option>
        <option value="Australia/Sydney">UTC+10/+11 (Sydney)</option>
      </select>
      <div class="text-xs text-gray-500 mt-1">
        <div>📍 Your browser timezone: {{ browserTimezone }}</div>
        <div>🌍 Selected timezone: {{ selectedTimezone }}</div>
      </div>
    </div>

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
        <label class="text-xs text-gray-500 mt-1">Date ({{ selectedTimezone }})</label>
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
        <label class="text-xs text-gray-500 mt-1">Time ({{ selectedTimezone }})</label>
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <div class="flex gap-2 mt-3 flex-wrap">
      <button
        type="button"
        @click="setToNow"
        class="btn btn-xs btn-outline"
      >
        📅 Now ({{ selectedTimezone }})
      </button>
      <button
        type="button"
        @click="setToday9AM"
        class="btn btn-xs btn-outline"
      >
        🌅 Today 9AM ({{ selectedTimezone }})
      </button>
      <button
        type="button"
        @click="setToday5PM"
        class="btn btn-xs btn-outline"
      >
        🌆 Today 5PM ({{ selectedTimezone }})
      </button>
      <button
        type="button"
        @click="setTomorrow9AM"
        class="btn btn-xs btn-outline"
      >
        ➡️ Tomorrow 9AM ({{ selectedTimezone }})
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
    <div v-if="modelValue" class="mt-2 p-3 bg-base-200 rounded text-sm space-y-1">
      <div><strong>Selected Time:</strong></div>
      <div class="ml-2">
        <!-- <div>🌍 {{ selectedTimezone }}: {{ formatDisplayValue }}</div> -->
        <div v-if="selectedTimezone !== browserTimezone" class="text-gray-600">
          📍 On Your timezone ({{ browserTimezone }}): {{ formatDisplayValueInBrowserTimezone }}
        </div>
      </div>
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
import { ref, computed, watch, onMounted } from 'vue'
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

// Timezone visibility toggle
const showTimezoneSettings = ref(false)

// Timezone management
const selectedTimezone = ref('UTC') // Default to UTC
const browserTimezone = ref('')

// Get browser timezone
const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

// Initialize timezone
onMounted(() => {
  browserTimezone.value = getBrowserTimezone()

  // Load saved timezone from localStorage or default to UTC
  const savedTimezone = localStorage.getItem('timestamp-component-timezone')
  selectedTimezone.value = savedTimezone || 'UTC'
})

// Handle timezone change
const handleTimezoneChange = () => {
  localStorage.setItem('timestamp-component-timezone', selectedTimezone.value)
  // Re-validate current value if exists
  if (props.modelValue) {
    validateInput(props.modelValue)
  }
}

// Get current time in selected timezone
const getCurrentTimeInTimezone = (): Date => {
  const now = new Date()

  if (selectedTimezone.value === 'UTC') {
    return now
  }

  // For non-UTC timezones, we need to get the actual current time in that timezone
  // We do this by getting what "now" looks like in that timezone
  return now
}

// Convert a datetime string (YYYY-MM-DDTHH:mm) from selected timezone to UTC
const convertFromTimezoneToUTC = (dateTimeString: string): string => {
  if (selectedTimezone.value === 'UTC') {
    return dateTimeString
  }

  try {
    // Create a date assuming the input is in the selected timezone
    // We need to trick JavaScript into thinking this local time is in our target timezone
    const [datePart, timePart] = dateTimeString.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)

    // Create a temporary date to find timezone offset
    const tempDate = new Date(year, month - 1, day, hours, minutes)

    // Get the timezone offset for our selected timezone at this date/time
    const utcTime = tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000)
    const tzTime = new Date(utcTime).toLocaleString('sv-SE', { timeZone: selectedTimezone.value })
    const tzDate = new Date(tzTime)
    const offset = tempDate.getTime() - tzDate.getTime()

    // Apply the offset to get the correct UTC time
    const utcDate = new Date(tempDate.getTime() - offset)
    return utcDate.toISOString().slice(0, 19)
  } catch (error) {
    console.error('Timezone conversion error:', error)
    return dateTimeString
  }
}

// Format date for input fields (in selected timezone)
const formatDateForInput = (utcDateString: string): { date: string, time: string } => {
  if (!utcDateString) return { date: '', time: '' }

  try {
    const utcDate = new Date(utcDateString)

    if (selectedTimezone.value === 'UTC') {
      const year = utcDate.getUTCFullYear()
      const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(utcDate.getUTCDate()).padStart(2, '0')
      const hours = String(utcDate.getUTCHours()).padStart(2, '0')
      const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0')

      return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`
      }
    } else {
      // Convert UTC to selected timezone for display
      const formatted = new Intl.DateTimeFormat('sv-SE', {
        timeZone: selectedTimezone.value,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(utcDate)

      const [datePart, timePart] = formatted.split(' ')
      return { date: datePart, time: timePart }
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return { date: '', time: '' }
  }
}

// Computed values for separate date and time
const dateValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const formatted = formatDateForInput(props.modelValue)
    return formatted.date
  } catch {
    return ''
  }
})

const timeValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const formatted = formatDateForInput(props.modelValue)
    return formatted.time
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
      timeZone: selectedTimezone.value,
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

const formatDisplayValueInBrowserTimezone = computed(() => {
  if (!props.modelValue || selectedTimezone.value === browserTimezone.value) return ''
  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return ''

    const options: Intl.DateTimeFormatOptions = {
      timeZone: browserTimezone.value,
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

    // Convert from selected timezone to UTC for storage
    const utcDateTime = convertFromTimezoneToUTC(dateTimeString)

    emit('update:modelValue', utcDateTime)
    validateInput(utcDateTime)
  } else if (!currentDate.value && !currentTime.value) {
    emit('update:modelValue', '')
    errorMessage.value = ''
  }
}

// Quick action methods (all now work in selected timezone)
const setToNow = () => {
  const now = new Date()

  if (selectedTimezone.value === 'UTC') {
    // For UTC, we use the current UTC time
    const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    setDateTime(utcNow)
  } else {
    // For other timezones, get what time it is NOW in that timezone
    const nowInTimezone = new Intl.DateTimeFormat('sv-SE', {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now)

    const [datePart, timePart] = nowInTimezone.split(' ')
    currentDate.value = datePart
    currentTime.value = timePart
    updateDateTime()
  }
}

const setToday9AM = () => {
  const now = new Date()

  if (selectedTimezone.value === 'UTC') {
    const utcToday = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    utcToday.setUTCHours(9, 0, 0, 0)
    setDateTime(utcToday)
  } else {
    // Get today's date in the selected timezone and set to 9 AM
    const todayInTimezone = new Intl.DateTimeFormat('sv-SE', {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now)

    currentDate.value = todayInTimezone
    currentTime.value = '09:00'
    updateDateTime()
  }
}

const setToday5PM = () => {
  const now = new Date()

  if (selectedTimezone.value === 'UTC') {
    const utcToday = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    utcToday.setUTCHours(17, 0, 0, 0)
    setDateTime(utcToday)
  } else {
    // Get today's date in the selected timezone and set to 5 PM
    const todayInTimezone = new Intl.DateTimeFormat('sv-SE', {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now)

    currentDate.value = todayInTimezone
    currentTime.value = '17:00'
    updateDateTime()
  }
}

const setTomorrow9AM = () => {
  const now = new Date()

  if (selectedTimezone.value === 'UTC') {
    const utcTomorrow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    utcTomorrow.setUTCDate(utcTomorrow.getUTCDate() + 1)
    utcTomorrow.setUTCHours(9, 0, 0, 0)
    setDateTime(utcTomorrow)
  } else {
    // Get tomorrow's date in the selected timezone and set to 9 AM
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const tomorrowInTimezone = new Intl.DateTimeFormat('sv-SE', {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(tomorrow)

    currentDate.value = tomorrowInTimezone
    currentTime.value = '09:00'
    updateDateTime()
  }
}

const setDateTime = (date: Date) => {
  if (selectedTimezone.value === 'UTC') {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')

    currentDate.value = `${year}-${month}-${day}`
    currentTime.value = `${hours}:${minutes}`
  } else {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    currentDate.value = `${year}-${month}-${day}`
    currentTime.value = `${hours}:${minutes}`
  }

  updateDateTime()
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
      const formatted = formatDateForInput(newValue)
      currentDate.value = formatted.date
      currentTime.value = formatted.time
    } catch {
      currentDate.value = ''
      currentTime.value = ''
    }
  } else {
    currentDate.value = ''
    currentTime.value = ''
  }
}, { immediate: true })

// Watch for timezone changes and update display
watch(selectedTimezone, () => {
  if (props.modelValue) {
    try {
      const formatted = formatDateForInput(props.modelValue)
      currentDate.value = formatted.date
      currentTime.value = formatted.time
    } catch {
      currentDate.value = ''
      currentTime.value = ''
    }
  }
})

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
