<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">{{ props.label }}</span>
        </label>

        <input class="input input-primary input-bordered" name="{{ props.name }}" id="{{ props.id }}"
            :placeholder="props.placeholder" v-model="searchString" @keyup="searchImage" />

        <span class="invalid-feedback text-primary" role="alert">
            <strong>{{ errorMessage }}</strong>
        </span>
        <!-- Show the search results -->
        <ul class="menu bg-neutral-content w-full" v-if="availableItems.data">
            <li v-for="(item, index) in availableItems.data" :key="index" @click="addItem(item)">
                <a class="hover:active">{{ item.name }}</a>
            </li>
        </ul>

        <!-- Show the selected items -->
        <div class="my-5">
            <div class="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4 border-l-transparent bg-gradient-to-r from-transparent to-transparent hover:from-base-300 transition ease-linear duration-150 text-base-content"
                v-for="(item, index) in selectedItem" :key="index" @click="removeItem(index)" >
                <div class="inline-flex items-center space-x-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 text-primary hover:text-secondary hover:cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>

                    </div>
                    <div>{{ item.name }}</div>
                </div>
                <div @click="removeItem(index)" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 text-primary hover:text-secondary hover:cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Import axios
import axios from "axios";

import { watch, onMounted, defineEmits } from "vue";
import { usePage } from "@inertiajs/inertia-vue3";

let errorMessage = $ref(null);

watch(
    () => usePage().props?.value?.errors,
    (v) => {
        if (usePage().props.value.errors[props.name]) {
            errorMessage = usePage().props.value.errors[props.name];
        }
    }
);

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
        default: "",
    },
    modelValue: {
        type: String,
        default: "",
    },
    model: {
        type: String,
        default: "",
    },
    columns: {
        type: Object,
        default: null,
    },
    endpoint: {
        type: String,
        default: "",
    },
    loadData: {
        type: Object,
        default: null,
    },
    singleMode: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const update = (event) => {
    emit("update:modelValue", event.target.value);
};

let searchString = $ref("");
let availableItems = $ref("");
const searchImage = async () => {
    axios
        .post(props.endpoint, {
            search: searchString,
            model: props.model,
            columns: props.columns
        })
        .then(function (response) {
            availableItems = response.data;
        })
        .catch(function (error) {
            for (const [key, value] of Object.entries(error.response.data.errors)) {
                message.error(value[0]);
            }
        });
};

let selectedItem = $ref([]);

const addItem = async (item) => {
    if (props.singleMode) {
        selectedItem = [];
    }
    // Add the image to the selected media make sure is unique value
    if (selectedItem.indexOf(item) === -1) {
        selectedItem.push({
            id: item.id,
            name: item.name,
        });
    }
    availableItems = [];

    emit("update:modelValue", selectedItem);
};

const removeItem = async (index) => {
    selectedItem.splice(index, 1);

    emit("update:modelValue", selectedItem);
};

onMounted(() => {
    if (props.loadData) {
        if (props.singleMode) {
            selectedItem = [props.loadData];
        } else {
            selectedItem = props.loadData;
        }
    }
})

</script>
