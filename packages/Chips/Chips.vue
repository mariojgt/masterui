<template>
    <div class="form-control">
      <label class="label">
        <span :class="labelClass">{{ props.label }}</span>
      </label>
      <div class="flex flex-col gap-4">
        <!-- Input field -->
        <input
          :class="inputClass"
          :type="props.type"
          :name="props.name"
          :id="props.id"
          :placeholder="props.placeholder"
          v-model="currentCommand"
          @keydown.enter.prevent="addCommand"
        />

        <!-- Commands display area -->
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(command, index) in commands"
            :key="index"
            class="badge badge-primary gap-2 p-4 font-mono text-sm"
          >
            {{ command }}
            <button
              @click="removeCommand(index)"
              class="btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <span v-if="errorMessage" :class="messageClass" role="alert">
        <strong>{{ errorMessage }}</strong>
      </span>
    </div>
  </template>

  <script setup lang="ts">
  import { watch, ref, defineEmits } from "vue";
  import { usePage } from "@inertiajs/vue3";

  const currentCommand = ref("");
  const commands = ref<string[]>([]);
  let errorMessage = ref(null);

  // Watch for errors from Inertia
  watch(
    () => usePage().props?.errors,
    () => {
      if (usePage().props.errors[props.name]) {
        errorMessage.value = usePage().props.errors[props.name];
      }
    }
  );

  // Props definition
  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Type a command and press Enter (e.g. php artisan migrate)",
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: Array as () => string[],
      default: () => [],
    },
    messageClass: {
      type: String,
      default: "invalid-feedback text-primary",
    },
    labelClass: {
      type: String,
      default: "block text-lg font-bold mb-2",
    },
    inputClass: {
      type: String,
      default: "input input-primary input-bordered",
    },
  });

  // Emit setup
  const emit = defineEmits(["update:modelValue"]);

  // Initialize commands from modelValue
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue && Array.isArray(newValue)) {
        commands.value = [...newValue];
      }
    },
    { immediate: true }
  );

  // Add new command
  const addCommand = () => {
    const trimmedCommand = currentCommand.value.trim();
    if (trimmedCommand && !commands.value.includes(trimmedCommand)) {
      commands.value.push(trimmedCommand);
      emit("update:modelValue", commands.value);
      currentCommand.value = ""; // Clear input after adding
    }
  };

  // Remove command
  const removeCommand = (index: number) => {
    commands.value.splice(index, 1);
    emit("update:modelValue", commands.value);
  };
  </script>
