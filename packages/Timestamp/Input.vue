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
        <div>⏰ Current time in {{ selectedTimezone }}: {{ currentTimeInSelectedTimezone }}</div>
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
        <div>🌍 {{ selectedTimezone }}: {{ formatDisplayValue }}</div>
        <div v-if="selectedTimezone !== browserTimezone" class="text-gray-600">
          📍 Your timezone ({{ browserTimezone }}): {{ formatDisplayValueInBrowserTimezone }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          UTC: {{ modelValue }}
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
const selectedTimezone = ref('UTC')
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
  const savedTimezone = localStorage.getItem('timestamp-component-timezone')
  selectedTimezone.value = savedTimezone || browserTimezone.value || 'UTC'
})

// Handle timezone change
const handleTimezoneChange = () => {
  localStorage.setItem('timestamp-component-timezone', selectedTimezone.value)
}

// Show current time in selected timezone (for debugging/display)
const currentTimeInSelectedTimezone = computed(() => {
  const now = new Date()
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: selectedTimezone.value,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now)
})

/**
 * CORE TIMEZONE CONVERSION FUNCTIONS
 * These are the critical functions that handle timezone conversions properly
 */

/**
 * Convert a local datetime string (YYYY-MM-DDTHH:mm) in the selected timezone to UTC ISO string
 * This is used when the user inputs a date/time in their selected timezone
 */
const convertLocalDateTimeToUTC = (localDateTimeString: string): string => {
  if (!localDateTimeString) return ''

  try {
    // Parse the local date time string
    const [datePart, timePart] = localDateTimeString.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)

    if (selectedTimezone.value === 'UTC') {
      // If timezone is UTC, create date directly
      const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes))
      return utcDate.toISOString().slice(0, 19)
    } else {
      // For non-UTC timezones, we need to create a date that represents
      // the given time in the selected timezone, then convert to UTC

      // Create a date string that will be interpreted in the selected timezone
      const dateInTimezone = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`

      // Use a temporary element to parse the date in the target timezone
      // This is a reliable way to handle timezone conversion
      const tempDate = new Date(dateInTimezone)

      // Get what this date/time would be if it were in the selected timezone
      // by using toLocaleString to format it as if it were in that timezone
      const utcTimestamp = Date.parse(dateInTimezone + '+00:00') // Assume it's UTC first
      const localTimestamp = new Date(utcTimestamp).toLocaleString('sv-SE', {
        timeZone: selectedTimezone.value
      })

      // Calculate the difference
      const localDate = new Date(localTimestamp)
      const offset = utcTimestamp - localDate.getTime()

      // Apply the offset to get the correct UTC time
      const correctUtcTime = new Date(Date.parse(dateInTimezone) - offset)

      // Actually, let's use a more reliable method:
      // Create the date assuming it's in the local browser timezone, then adjust
      const localDateObj = new Date(year, month - 1, day, hours, minutes)

      // Get the offset for the selected timezone at this specific date/time
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: selectedTimezone.value,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      // This is the most reliable approach: use the Temporal-like behavior
      // Create a date that represents the exact moment in the selected timezone
      const targetDate = new Date(`${dateInTimezone}`)

      // Get the timezone offset at this date
      const utcDate = new Date(targetDate.toLocaleString('sv-SE', { timeZone: 'UTC' }))
      const tzDate = new Date(targetDate.toLocaleString('sv-SE', { timeZone: selectedTimezone.value }))
      const offset2 = utcDate.getTime() - tzDate.getTime()

      // Apply offset to get correct UTC time
      const finalUtcDate = new Date(targetDate.getTime() + offset2)

      // Let's use the most straightforward approach that actually works:
      // Use the Intl API to properly handle the conversion

      // The simplest and most reliable way:
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

      // Create a date object representing this time in the selected timezone
      // We'll use a known reference point and calculate the offset
      const now = new Date()
      const nowUtc = now.getTime()
      const nowInTargetTz = new Date(now.toLocaleString('sv-SE', { timeZone: selectedTimezone.value }))
      const tzOffset = nowUtc - nowInTargetTz.getTime()

      // Create the target date and apply the timezone offset
      const targetDateTime = new Date(`${dateStr}T${timeStr}:00`)
      const utcDateTime = new Date(targetDateTime.getTime() + tzOffset)

      return utcDateTime.toISOString().slice(0, 19)
    }
  } catch (error) {
    console.error('Error converting local datetime to UTC:', error)
    return localDateTimeString
  }
}

/**
 * Convert a UTC datetime string to local datetime string in the selected timezone
 * This is used to display the stored UTC value in the user's selected timezone
 */
const convertUTCToLocalDateTime = (utcDateTimeString: string): { date: string, time: string } => {
  if (!utcDateTimeString) return { date: '', time: '' }

  try {
    // Create a proper Date object from the UTC string
    let utcDate: Date

    // Handle the case where the string might not have 'Z' or timezone info
    if (utcDateTimeString.includes('T')) {
      // If it looks like an ISO string but doesn't end with Z, add it
      const isoString = utcDateTimeString.endsWith('Z') ? utcDateTimeString : utcDateTimeString + 'Z'
      utcDate = new Date(isoString)
    } else {
      utcDate = new Date(utcDateTimeString)
    }

    if (isNaN(utcDate.getTime())) {
      console.error('Invalid date:', utcDateTimeString)
      return { date: '', time: '' }
    }

    // Convert to the selected timezone using Intl API
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    const parts = formatter.formatToParts(utcDate)
    const dateStr = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`
    const timeStr = `${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}`

    return { date: dateStr, time: timeStr }
  } catch (error) {
    console.error('Error converting UTC to local datetime:', error)
    return { date: '', time: '' }
  }
}

// Computed values for the input fields
const dateValue = computed(() => {
  if (!props.modelValue) return ''
  const { date } = convertUTCToLocalDateTime(props.modelValue)
  return date
})

const timeValue = computed(() => {
  if (!props.modelValue) return ''
  const { time } = convertUTCToLocalDateTime(props.modelValue)
  return time
})

// Display formatting
const formatDisplayValue = computed(() => {
  if (!props.modelValue) return ''
  try {
    const utcDate = new Date(props.modelValue.endsWith('Z') ? props.modelValue : props.modelValue + 'Z')
    if (isNaN(utcDate.getTime())) return ''

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: selectedTimezone.value,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(utcDate)
  } catch {
    return ''
  }
})

const formatDisplayValueInBrowserTimezone = computed(() => {
  if (!props.modelValue || selectedTimezone.value === browserTimezone.value) return ''
  try {
    const utcDate = new Date(props.modelValue.endsWith('Z') ? props.modelValue : props.modelValue + 'Z')
    if (isNaN(utcDate.getTime())) return ''

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: browserTimezone.value,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(utcDate)
  } catch {
    return ''
  }
})

// Event handlers
const handleDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateDateTime(target.value, timeValue.value)
}

const handleDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateDateTime(target.value, timeValue.value)
}

const handleTimeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateDateTime(dateValue.value, target.value)
}

const handleTimeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateDateTime(dateValue.value, target.value)
}

const updateDateTime = (date: string, time: string) => {
  if (date && time) {
    const localDateTime = `${date}T${time}`
    const utcDateTime = convertLocalDateTimeToUTC(localDateTime)
    emit('update:modelValue', utcDateTime)
    validateInput(utcDateTime)
  } else if (!date && !time) {
    emit('update:modelValue', '')
    errorMessage.value = ''
  }
}

// Quick action methods
const setToNow = () => {
  const now = new Date()

  // Get current time in the selected timezone
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: selectedTimezone.value,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const formatted = formatter.format(now)
  const [date, time] = formatted.split(' ')

  updateDateTime(date, time)
}

const setToday9AM = () => {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: selectedTimezone.value,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const todayFormatted = formatter.format(today)
  updateDateTime(todayFormatted, '09:00')
}

const setToday5PM = () => {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: selectedTimezone.value,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const todayFormatted = formatter.format(today)
  updateDateTime(todayFormatted, '17:00')
}

const setTomorrow9AM = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: selectedTimezone.value,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const tomorrowFormatted = formatter.format(tomorrow)
  updateDateTime(tomorrowFormatted, '09:00')
}

const clearDateTime = () => {
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
