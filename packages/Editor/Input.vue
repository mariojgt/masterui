<template>
    <div class="form-control w-full">
        <label :for="id" class="label" v-if="label || $slots.label">
            <slot name="label">
                <span class="label-text font-semibold">{{ label }}</span>
            </slot>
        </label>

        <div class="border border-base-300 rounded-lg overflow-hidden">
            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-1 p-2 bg-base-200 border-b border-base-300">
                <div class="dropdown">
                    <label tabindex="0" class="btn btn-xs btn-ghost">Format</label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li><a @click="formatDoc('formatBlock', 'h1')">Heading 1</a></li>
                        <li><a @click="formatDoc('formatBlock', 'h2')">Heading 2</a></li>
                        <li><a @click="formatDoc('formatBlock', 'h3')">Heading 3</a></li>
                        <li><a @click="formatDoc('formatBlock', 'p')">Paragraph</a></li>
                    </ul>
                </div>

                <div class="divider divider-horizontal"></div>

                <button type="button" @click="formatDoc('bold')" class="btn btn-xs btn-ghost" title="Bold">
                    <strong>B</strong>
                </button>
                <button type="button" @click="formatDoc('italic')" class="btn btn-xs btn-ghost" title="Italic">
                    <em>I</em>
                </button>
                <button type="button" @click="formatDoc('underline')" class="btn btn-xs btn-ghost" title="Underline">
                    <u>U</u>
                </button>

                <div class="divider divider-horizontal"></div>

                <button type="button" @click="formatDoc('insertUnorderedList')" class="btn btn-xs btn-ghost" title="Bullet List">
                    •
                </button>
                <button type="button" @click="formatDoc('insertOrderedList')" class="btn btn-xs btn-ghost" title="Numbered List">
                    1.
                </button>
            </div>

            <!-- Editor Area -->
            <div
                ref="editorRef"
                :id="id"
                contenteditable="true"
                spellcheck="true"
                :placeholder="placeholder"
                @input="handleInput"
                @paste="handlePaste"
                @blur="handleBlur"
                :class="['min-h-[120px] max-h-[400px] overflow-y-auto p-4 focus:outline-none', { 'border-error': errorMessage }]"
            ></div>
        </div>

        <div v-if="errorMessage" class="label">
            <span class="label-text-alt text-error">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

interface EditorProps {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}

const props = withDefaults(defineProps<EditorProps>(), {
    label: '',
    placeholder: '',
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

const errors = computed(() => page.props?.errors || {});

watch(
    errors,
    (newErrors) => {
        errorMessage.value = newErrors[props.name] || null;
    },
    { deep: true }
);

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

const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    if (text) {
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

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editorRef.value || isComposing.value) return;
        if (newValue !== editorRef.value.innerHTML) {
            editorRef.value.innerHTML = newValue || '';
        }
    }
);

onMounted(() => {
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

    if (props.modelValue) {
        editorRef.value.innerHTML = props.modelValue;
    }
});
</script>
