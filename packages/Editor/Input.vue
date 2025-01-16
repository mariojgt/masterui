<template>
    <div class="form-control">
      <label :for="id" class="label">
        <span :class="labelClass">{{ label }}</span>
      </label>

      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border rounded-t-lg">
        <!-- Text Style Dropdown -->
        <div class="flex-shrink-0">
          <select
            @change="formatDoc('formatBlock', $event.target.value)"
            class="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>

        <!-- Divider -->
        <div class="h-6 w-px bg-gray-300"></div>

        <!-- Format Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in formatButtons"
            :key="index"
            @click.prevent="formatDoc(btn.command)"
            :title="btn.title"
            class="p-1.5 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{ 'bg-gray-100 text-primary border-primary': isFormatActive(btn.command) }"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- Divider -->
        <div class="h-6 w-px bg-gray-300"></div>

        <!-- List Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in listButtons"
            :key="index"
            @click.prevent="formatDoc(btn.command)"
            :title="btn.title"
            class="p-1.5 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{ 'bg-gray-100 text-primary border-primary': isFormatActive(btn.command) }"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- Divider -->
        <div class="h-6 w-px bg-gray-300"></div>

        <!-- Alignment Buttons -->
        <div class="flex gap-1">
          <button
            v-for="(btn, index) in alignButtons"
            :key="index"
            @click.prevent="formatDoc(btn.command)"
            :title="btn.title"
            class="p-1.5 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{ 'bg-gray-100 text-primary border-primary': isFormatActive(btn.command) }"
          >
            <component :is="btn.icon" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Editor Area -->
      <div
        ref="editorRef"
        :id="id"
        contenteditable="true"
        spellcheck="true"
        dir="ltr"
        :placeholder="placeholder"
        @input="handleInput"
        @paste="handlePaste"
        @blur="handleBlur"
        :class="[
          inputClass,
          'min-h-[200px] max-h-[600px] overflow-y-auto p-4 focus:outline-none',
          { 'error': errorMessage }
        ]"
      ></div>

      <!-- Character Count -->
      <div v-if="maxLength" class="mt-1 text-sm text-gray-500 text-right">
        {{ currentLength }} / {{ maxLength }} characters
      </div>

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
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import { usePage } from '@inertiajs/vue3';
  import DOMPurify from 'dompurify';
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
    Quote
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
    inputClass: 'border border-gray-300 rounded-b-lg',
    required: false
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
  }>();

  const editorRef = ref<HTMLDivElement | null>(null);
  const errorMessage = ref<string | null>(null);
  const page = usePage();
  const isComposing = ref(false);

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

  const currentLength = computed(() => {
    if (!editorRef.value) return 0;
    return editorRef.value.textContent?.length || 0;
  });

  const handleInput = () => {
    if (isComposing.value || !editorRef.value) return;
    emit('update:modelValue', editorRef.value.innerHTML);
    validateInput();
  };

  const formatDoc = (command: string, value: string | null = null) => {
    if (!editorRef.value) return;

    editorRef.value.focus();

    try {
      if (command === 'createLink') {
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === 'formatBlock') {
        document.execCommand(command, false, `<${value}>`);
      } else {
        document.execCommand(command, false, value);
      }
      handleInput();
    } catch (error) {
      console.error('Format error:', error);
    }
  };

  const isFormatActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const html = e.clipboardData?.getData('text/html');
    const text = e.clipboardData?.getData('text/plain');

    if (html) {
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['href']
      });
      document.execCommand('insertHTML', false, sanitized);
    } else if (text) {
      document.execCommand('insertText', false, text);
    }

    handleInput();
  };

  const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
    validateInput();
  };

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

  // Setup editor and event listeners
  const setupEditor = () => {
    if (!editorRef.value) return;

    const handleCompositionStart = () => {
      isComposing.value = true;
    };

    const handleCompositionEnd = () => {
      isComposing.value = false;
      handleInput();
    };

    editorRef.value.addEventListener('compositionstart', handleCompositionStart);
    editorRef.value.addEventListener('compositionend', handleCompositionEnd);

    // Set initial content
    if (props.modelValue) {
      editorRef.value.innerHTML = DOMPurify.sanitize(props.modelValue);
    }

    // Set placeholder if needed
    if (!props.modelValue && props.placeholder) {
      editorRef.value.innerHTML = `<p class="text-gray-400">${props.placeholder}</p>`;
    }

    return () => {
      if (!editorRef.value) return;
      editorRef.value.removeEventListener('compositionstart', handleCompositionStart);
      editorRef.value.removeEventListener('compositionend', handleCompositionEnd);
    };
  };

  // Watch for external value changes
  watch(
    () => props.modelValue,
    (newValue) => {
      if (!editorRef.value || isComposing.value) return;

      const currentContent = editorRef.value.innerHTML;
      if (newValue !== currentContent) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        editorRef.value.innerHTML = DOMPurify.sanitize(newValue || '');

        if (range && selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  );

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

  // Initialize on mount
  onMounted(() => {
    const cleanup = setupEditor();
    onUnmounted(() => cleanup?.());
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
  :deep(code) { @apply font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm; }
  :deep(ul) { @apply list-disc ml-6 mb-4; }
  :deep(ol) { @apply list-decimal ml-6 mb-4; }
  :deep(a) { @apply text-blue-600 hover:underline; }

  [contenteditable=true]:empty:before {
    content: attr(placeholder);
    @apply text-gray-400;
    cursor: text;
  }
  </style>
