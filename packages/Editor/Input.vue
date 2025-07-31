<template>
    <div class="form-control w-full" :class="{ 'fullscreen-editor': isFullscreen }">
        <label :for="id" class="label" v-if="(label || $slots.label) && !isFullscreen">
            <slot name="label">
                <span class="label-text font-semibold text-base-content/90">{{ label }}</span>
            </slot>
        </label>

        <div class="border border-base-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-base-100" :class="{ 'fullscreen-container': isFullscreen }">
            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-1 p-3 bg-gradient-to-r from-base-200 to-base-200/80 border-b border-base-300/70">
                <!-- Mode Selector -->
                <div v-if="showModeToggle" class="dropdown">
                    <label tabindex="0" class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        {{ currentMode.toUpperCase() }}
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-lg border border-base-300 w-40 z-50">
                        <li>
                            <a @click="switchToMode('html')" class="hover:bg-primary hover:text-primary-content" :class="{ 'bg-primary text-primary-content': currentMode === 'html' }">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                                HTML Editor
                            </a>
                        </li>
                        <li>
                            <a @click="switchToMode('markdown')" class="hover:bg-primary hover:text-primary-content" :class="{ 'bg-primary text-primary-content': currentMode === 'markdown' }">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Markdown
                            </a>
                        </li>
                    </ul>
                </div>

                <div v-if="showModeToggle" class="divider divider-horizontal my-0 w-px bg-base-300"></div>

                <!-- Format Dropdown -->
                <div class="dropdown">
                    <label tabindex="0" class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                        </svg>
                        Format
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-lg border border-base-300 w-40 z-50">
                        <li><a @click="formatDoc('formatBlock', 'h1')" class="hover:bg-primary hover:text-primary-content">
                            <span class="text-xl font-bold">H1</span> Heading 1
                        </a></li>
                        <li><a @click="formatDoc('formatBlock', 'h2')" class="hover:bg-primary hover:text-primary-content">
                            <span class="text-lg font-bold">H2</span> Heading 2
                        </a></li>
                        <li><a @click="formatDoc('formatBlock', 'h3')" class="hover:bg-primary hover:text-primary-content">
                            <span class="text-base font-bold">H3</span> Heading 3
                        </a></li>
                        <li><a @click="formatDoc('formatBlock', 'p')" class="hover:bg-primary hover:text-primary-content">
                            <span>P</span> Paragraph
                        </a></li>
                    </ul>
                </div>

                <div class="divider divider-horizontal my-0 w-px bg-base-300"></div>

                <!-- Text Formatting -->
                <div class="flex items-center gap-1">
                    <button
                        type="button"
                        @click="formatDoc('bold')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Bold (Ctrl+B)"
                    >
                        <strong class="text-sm">B</strong>
                    </button>
                    <button
                        type="button"
                        @click="formatDoc('italic')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Italic (Ctrl+I)"
                    >
                        <em class="text-sm">I</em>
                    </button>
                    <button
                        type="button"
                        @click="formatDoc('underline')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Underline (Ctrl+U)"
                    >
                        <u class="text-sm">U</u>
                    </button>
                    <button
                        type="button"
                        @click="formatDoc('strikeThrough')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Strikethrough"
                    >
                        <s class="text-sm">S</s>
                    </button>
                </div>

                <div class="divider divider-horizontal my-0 w-px bg-base-300"></div>

                <!-- Lists and Links -->
                <div class="flex items-center gap-1">
                    <button
                        type="button"
                        @click="formatDoc('insertUnorderedList')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Bullet List"
                    >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 100 2 1 1 0 000-2zM6 4h11a1 1 0 110 2H6a1 1 0 110-2zM3 9a1 1 0 100 2 1 1 0 000-2zM6 9h11a1 1 0 110 2H6a1 1 0 110-2zM3 14a1 1 0 100 2 1 1 0 000-2zM6 14h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        @click="formatDoc('insertOrderedList')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Numbered List"
                    >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4h1v1H3V4zM6 4h11a1 1 0 110 2H6a1 1 0 110-2zM3 9h1v1H3V9zM6 9h11a1 1 0 110 2H6a1 1 0 110-2zM3 14h1v1H3v-1zM6 14h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        @click="formatDoc('createLink')"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        title="Insert Link"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                    </button>
                </div>

                <div class="divider divider-horizontal my-0 w-px bg-base-300"></div>

                <!-- Additional Tools -->
                <div class="flex items-center gap-1">
                    <button
                        type="button"
                        @click="formatDoc('removeFormat')"
                        class="btn btn-sm btn-ghost hover:btn-error hover:text-error-content transition-colors duration-200"
                        title="Clear Formatting"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Fullscreen Toggle -->
                <div v-if="allowFullscreen" class="flex items-center gap-1 ml-auto">
                    <div class="divider divider-horizontal my-0 w-px bg-base-300"></div>
                    <button
                        type="button"
                        @click="toggleFullscreen"
                        class="btn btn-sm btn-ghost hover:btn-primary hover:text-primary-content transition-colors duration-200"
                        :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
                    >
                        <svg v-if="!isFullscreen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Editor Area -->
            <div class="relative">
                <!-- HTML Editor -->
                <div
                    v-show="currentMode === 'html'"
                    ref="htmlEditorRef"
                    :id="id"
                    contenteditable="true"
                    spellcheck="true"
                    :placeholder="placeholder || 'Start typing...'"
                    @input="handleHtmlInput"
                    @paste="handlePaste"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                    :class="[
                        'prose prose-sm max-w-none overflow-y-auto p-6 focus:outline-none transition-all duration-200',
                        'prose-headings:text-base-content prose-p:text-base-content prose-strong:text-base-content prose-em:text-base-content',
                        'prose-a:text-primary hover:prose-a:text-primary-focus prose-a:no-underline hover:prose-a:underline',
                        'prose-ul:text-base-content prose-ol:text-base-content prose-li:text-base-content',
                        isFullscreen ? 'min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)]' : 'min-h-[150px] max-h-[500px]',
                        { 'ring-2 ring-error ring-opacity-50': $page.props.errors?.[name] || (required && !modelValue) }
                    ]"
                    style="outline: none !important;"
                ></div>

                <!-- Markdown Editor -->
                <textarea
                    v-show="currentMode === 'markdown'"
                    ref="markdownEditorRef"
                    :placeholder="placeholder || 'Start typing in Markdown...'"
                    @input="handleMarkdownInput"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                    :class="[
                        'w-full resize-none p-6 bg-transparent border-none focus:outline-none transition-all duration-200',
                        'text-base-content placeholder:text-base-content/40 font-mono text-sm leading-relaxed',
                        isFullscreen ? 'min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)]' : 'min-h-[150px] max-h-[500px]',
                        { 'ring-2 ring-error ring-opacity-50': $page.props.errors?.[name] || (required && !modelValue) }
                    ]"
                    :value="markdownContent"
                    style="outline: none !important;"
                ></textarea>

                <!-- Preview Mode Indicator -->
                <div v-if="showPreview && currentMode === 'markdown'" class="absolute top-4 right-4">
                    <div class="badge badge-primary badge-sm">Preview</div>
                </div>
            </div>

            <!-- Markdown Preview -->
            <div v-if="currentMode === 'markdown' && showPreview" class="border-t border-base-300">
                <div class="p-4 bg-base-50/50">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-base-content/70">Preview</h4>
                        <button
                            @click="showPreview = false"
                            class="btn btn-xs btn-ghost"
                            title="Hide Preview"
                        >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div
                        class="prose prose-sm max-w-none text-base-content"
                        v-html="renderedMarkdown"
                    ></div>
                </div>
            </div>

            <!-- Markdown Preview Toggle -->
            <div v-if="currentMode === 'markdown'" class="flex justify-between items-center p-2 bg-base-200/50 border-t border-base-300/50">
                <button
                    @click="showPreview = !showPreview"
                    class="btn btn-xs btn-ghost text-base-content/60 hover:text-base-content"
                >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
                </button>
                <div class="text-xs text-base-content/40">
                    Characters: {{ markdownContent.length }}
                </div>
            </div>
        </div>

        <div v-if="$page.props.errors?.[name] || (required && !modelValue && !isFullscreen)" class="label">
            <span class="label-text-alt text-error font-medium">
                {{ $page.props.errors?.[name] || `${label} is required` }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';

interface EditorProps {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    mode?: 'html' | 'markdown';
    showModeToggle?: boolean;
    allowFullscreen?: boolean;
}

const props = withDefaults(defineProps<EditorProps>(), {
    label: '',
    placeholder: '',
    required: false,
    mode: 'html',
    showModeToggle: true,
    allowFullscreen: true
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
    'modeChange': [mode: 'html' | 'markdown'];
}>();

const htmlEditorRef = ref<HTMLDivElement | null>(null);
const markdownEditorRef = ref<HTMLTextAreaElement | null>(null);
const isComposing = ref(false);
const currentMode = ref<'html' | 'markdown'>(props.mode);
const showPreview = ref(false);
const markdownContent = ref('');
const isFullscreen = ref(false);
const isUpdatingFromParent = ref(false);
const lastKnownHtmlContent = ref('');

const updateEditorContent = (content: string) => {
    // Only update if content actually changed to prevent cursor issues
    if (lastKnownHtmlContent.value === content) return;

    if (currentMode.value === 'html') {
        if (htmlEditorRef.value && htmlEditorRef.value.innerHTML !== content) {
            // Store cursor position
            const selection = window.getSelection();
            const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
            const cursorOffset = range ? range.startOffset : 0;
            const parentNode = range ? range.startContainer : null;

            htmlEditorRef.value.innerHTML = content;
            lastKnownHtmlContent.value = content;

            // Restore cursor position if possible
            if (parentNode && htmlEditorRef.value.contains(parentNode)) {
                try {
                    const newRange = document.createRange();
                    newRange.setStart(parentNode, Math.min(cursorOffset, parentNode.textContent?.length || 0));
                    newRange.collapse(true);
                    selection?.removeAllRanges();
                    selection?.addRange(newRange);
                } catch (e) {
                    // Cursor restoration failed, place at end
                    const newRange = document.createRange();
                    newRange.selectNodeContents(htmlEditorRef.value);
                    newRange.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(newRange);
                }
            }
        }
    } else {
        const markdown = htmlToMarkdown(content);
        if (markdownContent.value !== markdown) {
            markdownContent.value = markdown;
        }
    }
};

// Watch for changes in modelValue prop from parent
watch(() => props.modelValue, (newValue) => {
    if (isUpdatingFromParent.value) return;
    updateEditorContent(newValue);
}, { immediate: true });

// Improved markdown to HTML converter that preserves formatting
const markdownToHtml = (markdown: string): string => {
    if (!markdown.trim()) return '';

    let html = markdown
        // Preserve double line breaks as paragraph separators
        .replace(/\n\n/g, '</p><p>')
        // Headers (must come before other formatting)
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold (must come before italic)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Strikethrough
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        // Code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Single line breaks as <br>
        .replace(/\n/g, '<br>');

    // Handle unordered lists
    html = html.replace(/^\* (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Handle ordered lists
    html = html.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

    // Wrap content in paragraphs if it doesn't start with a block element
    if (!html.match(/^<(h[1-6]|p|ul|ol|div)/)) {
        html = '<p>' + html + '</p>';
    }

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    return html;
};

// Improved HTML to markdown converter that preserves structure
const htmlToMarkdown = (html: string): string => {
    if (!html.trim()) return '';

    let markdown = html
        // Headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
        // Bold
        .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**')
        // Italic
        .replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*')
        // Strikethrough
        .replace(/<(del|s)[^>]*>(.*?)<\/\1>/gi, '~~$2~~')
        // Code
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        // Links
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        // Lists
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1\n')
        .replace(/<\/?(ul|ol)[^>]*>/gi, '')
        // Paragraphs and line breaks
        .replace(/<\/p><p[^>]*>/gi, '\n\n')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br[^>]*\/?>/gi, '\n')
        // Remove remaining HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up extra newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return markdown;
};

const renderedMarkdown = computed(() => {
    return markdownToHtml(markdownContent.value);
});

const switchToMode = (mode: 'html' | 'markdown') => {
    if (mode === currentMode.value) return;

    if (mode === 'markdown') {
        // Convert HTML to Markdown
        const htmlContent = htmlEditorRef.value?.innerHTML || '';
        markdownContent.value = htmlToMarkdown(htmlContent);
    } else {
        // Convert Markdown to HTML
        const markdown = markdownContent.value;
        const htmlContent = markdownToHtml(markdown);
        nextTick(() => {
            if (htmlEditorRef.value) {
                htmlEditorRef.value.innerHTML = htmlContent;
                lastKnownHtmlContent.value = htmlContent;
            }
        });
    }

    currentMode.value = mode;
    emit('modeChange', mode);

    // Focus the appropriate editor
    nextTick(() => {
        if (mode === 'html' && htmlEditorRef.value) {
            htmlEditorRef.value.focus();
        } else if (mode === 'markdown' && markdownEditorRef.value) {
            markdownEditorRef.value.focus();
        }
    });
};

const handleHtmlInput = () => {
    if (isComposing.value || !htmlEditorRef.value) return;

    const content = htmlEditorRef.value.innerHTML;
    lastKnownHtmlContent.value = content;

    isUpdatingFromParent.value = true;
    emit('update:modelValue', content);
    nextTick(() => {
        isUpdatingFromParent.value = false;
    });
};

const handleMarkdownInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    markdownContent.value = target.value;
    isUpdatingFromParent.value = true;
    emit('update:modelValue', markdownToHtml(target.value));
    nextTick(() => {
        isUpdatingFromParent.value = false;
    });
};

const formatDoc = (command: string, value: string | null = null) => {
    if (!htmlEditorRef.value || currentMode.value !== 'html') return;
    htmlEditorRef.value.focus();

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
        handleHtmlInput();
    } catch (error) {
        console.error('Format error:', error);
    }
};

const handlePaste = (e: ClipboardEvent) => {
    // Allow default paste behavior to preserve formatting
    setTimeout(() => {
        handleHtmlInput();
    }, 0);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;

    if (isFullscreen.value) {
        document.body.style.overflow = 'hidden';
        // Focus the appropriate editor after entering fullscreen
        nextTick(() => {
            if (currentMode.value === 'html' && htmlEditorRef.value) {
                htmlEditorRef.value.focus();
            } else if (currentMode.value === 'markdown' && markdownEditorRef.value) {
                markdownEditorRef.value.focus();
            }
        });
    } else {
        document.body.style.overflow = '';
    }
};

const handleKeydown = (e: KeyboardEvent) => {
    // Handle escape key to exit fullscreen
    if (e.key === 'Escape' && isFullscreen.value) {
        e.preventDefault();
        toggleFullscreen();
        return;
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                if (currentMode.value === 'html') formatDoc('bold');
                break;
            case 'i':
                e.preventDefault();
                if (currentMode.value === 'html') formatDoc('italic');
                break;
            case 'u':
                e.preventDefault();
                if (currentMode.value === 'html') formatDoc('underline');
                break;
        }
    }

    // Tab handling for markdown
    if (e.key === 'Tab' && currentMode.value === 'markdown') {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        target.value = target.value.substring(0, start) + '  ' + target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + 2;
        handleMarkdownInput(e);
    }
};

onMounted(() => {
    if (!htmlEditorRef.value) return;

    const handleCompositionStart = () => {
        isComposing.value = true;
    };

    const handleCompositionEnd = () => {
        isComposing.value = false;
        handleHtmlInput();
    };

    htmlEditorRef.value.addEventListener('compositionstart', handleCompositionStart);
    htmlEditorRef.value.addEventListener('compositionend', handleCompositionEnd);

    // Initialize content
    updateEditorContent(props.modelValue);
    lastKnownHtmlContent.value = props.modelValue;

    // Cleanup fullscreen on unmount
    return () => {
        if (isFullscreen.value) {
            document.body.style.overflow = '';
        }
    };
});
</script>

<style scoped>
/* Fullscreen styles */
.fullscreen-editor {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: hsl(var(--b1)) !important;
    padding: 1rem !important;
    margin: 0 !important;
}

.fullscreen-container {
    height: 100% !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
}

.fullscreen-editor .fullscreen-container {
    display: flex !important;
    flex-direction: column !important;
}

/* Custom scrollbar for editor areas */
.prose::-webkit-scrollbar,
textarea::-webkit-scrollbar {
    width: 8px;
}

.prose::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track {
    background: transparent;
}

.prose::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb {
    background: hsl(var(--bc) / 0.2);
    border-radius: 4px;
}

.prose::-webkit-scrollbar-thumb:hover,
textarea::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--bc) / 0.3);
}

/* Enhanced editor styling */
.prose {
    color: hsl(var(--bc));
}

.prose [contenteditable]:empty:before {
    content: attr(placeholder);
    color: hsl(var(--bc) / 0.4);
    font-style: italic;
}

.prose h1, .prose h2, .prose h3 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}

.prose h1:first-child, .prose h2:first-child, .prose h3:first-child {
    margin-top: 0;
}

.prose p {
    margin-bottom: 1em;
}

.prose ul, .prose ol {
    margin: 1em 0;
    padding-left: 2em;
}

.prose li {
    margin: 0.25em 0;
}

.prose a {
    color: hsl(var(--p));
    transition: color 0.2s ease;
}

.prose a:hover {
    color: hsl(var(--pf));
    text-decoration: underline;
}

.prose code {
    background: hsl(var(--b2));
    padding: 0.125em 0.25em;
    border-radius: 0.25em;
    font-size: 0.875em;
}

/* Markdown editor enhancements */
textarea {
    line-height: 1.6;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Fira Code', monospace;
}

/* Animation for mode switching */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* Preserve whitespace and formatting */
.prose {
    white-space: pre-wrap;
}

.prose p {
    white-space: pre-wrap;
}
</style>
