<template>
    <div class="form-control">
      <label :for="id" class="label">
        <span :class="labelClass">{{ label }}</span>
      </label>

      <!-- Toolbar -->
      <div class="flex flex-wrap gap-1 p-2 mb-2 bg-gray-100 border rounded-t-lg">
        <!-- Text Style Dropdown -->
        <select
          @change="formatDoc('formatBlock', $event.target.value)"
          class="px-2 py-1 bg-white border rounded hover:bg-gray-50"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <!-- Format Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in formatButtons"
            :key="index"
            @click="formatDoc(btn.command)"
            :title="btn.title"
            class="p-2 text-gray-700 bg-white border rounded hover:bg-gray-50"
            :class="{ 'bg-gray-200': isFormatActive(btn.command) }"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- List Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in listButtons"
            :key="index"
            @click="formatDoc(btn.command)"
            :title="btn.title"
            class="p-2 text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- Alignment Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in alignButtons"
            :key="index"
            @click="formatDoc(btn.command)"
            :title="btn.title"
            class="p-2 text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Editor Area -->
      <div
        :id="id"
        :class="[
          inputClass,
          'min-h-[200px] max-h-[600px] overflow-y-auto p-4',
          { 'error': errorMessage }
        ]"
        contenteditable="true"
        @input="update"
        @blur="validateInput"
        @paste="handlePaste"
        ref="editorRef"
        v-html="modelValue"
      ></div>

      <!-- Error Message -->
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
  import { ref, watch, onMounted } from 'vue';
  import { usePage } from '@inertiajs/vue3';
  import type { PropType } from 'vue';
  import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link,
    Code,
    Quote,
    Undo,
    Redo
  } from 'lucide-vue-next';

  interface EditorProps {
    label: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    messageClass?: string;
    labelClass?: string;
    inputClass?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  }

  const props = withDefaults(defineProps<EditorProps>(), {
    placeholder: '',
    messageClass: 'text-red-500 text-sm mt-1',
    labelClass: 'block text-lg font-bold mb-2',
    inputClass: 'border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-primary focus:border-primary',
    required: false
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
  }>();

  const errorMessage = ref<string | null>(null);
  const editorRef = ref<HTMLDivElement | null>(null);
  const page = usePage();

  // Format buttons configuration
  const formatButtons = [
    { command: 'bold', icon: Bold, title: 'Bold' },
    { command: 'italic', icon: Italic, title: 'Italic' },
    { command: 'underline', icon: Underline, title: 'Underline' },
    { command: 'strikeThrough', icon: Strikethrough, title: 'Strike Through' },
    { command: 'createLink', icon: Link, title: 'Insert Link' },
    { command: 'code', icon: Code, title: 'Code' },
    { command: 'blockquote', icon: Quote, title: 'Quote' }
  ];

  const listButtons = [
    { command: 'insertUnorderedList', icon: List, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' }
  ];

  const alignButtons = [
    { command: 'justifyLeft', icon: AlignLeft, title: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, title: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, title: 'Align Right' },
    { command: 'justifyFull', icon: AlignJustify, title: 'Justify' }
  ];

  // Format document function
  const formatDoc = (command: string, value: string | null = null) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'formatBlock') {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.value?.focus();
  };

  // Check if format is active
  const isFormatActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  // Handle paste to strip formatting
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Update model value
  const update = () => {
    const content = editorRef.value?.innerHTML || '';
    emit('update:modelValue', content);
    validateInput();
  };

  // Validation
  const validateInput = () => {
    errorMessage.value = null;
    const content = editorRef.value?.textContent || '';

    if (props.required && !content.trim()) {
      errorMessage.value = `${props.label} is required`;
      return;
    }

    if (props.minLength && content.length < props.minLength) {
      errorMessage.value = `Minimum length is ${props.minLength} characters`;
      return;
    }

    if (props.maxLength && content.length > props.maxLength) {
      errorMessage.value = `Maximum length is ${props.maxLength} characters`;
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

  // Initialize editor
  onMounted(() => {
    if (editorRef.value && !props.modelValue) {
      editorRef.value.innerHTML = `<p>${props.placeholder}</p>`;
    }
  });
  </script>

  <style scoped>
  .form-control {
    @apply relative mb-4;
  }

  .error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500;
  }

  :deep(h1) { @apply text-4xl font-bold mb-4; }
  :deep(h2) { @apply text-3xl font-bold mb-3; }
  :deep(h3) { @apply text-2xl font-bold mb-3; }
  :deep(h4) { @apply text-xl font-bold mb-2; }
  :deep(h5) { @apply text-lg font-bold mb-2; }
  :deep(h6) { @apply text-base font-bold mb-2; }
  :deep(p) { @apply mb-4; }
  :deep(blockquote) { @apply border-l-4 border-gray-300 pl-4 italic my-4; }
  :deep(code) { @apply bg-gray-100 px-1 rounded; }
  :deep(ul) { @apply list-disc ml-6 mb-4; }
  :deep(ol) { @apply list-decimal ml-6 mb-4; }
  :deep(a) { @apply text-blue-600 hover:underline; }
  </style>
