<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">{{ props.label }}</span>
        </label>

        <input class="input input-primary input-bordered" name="{{ props.name }}" id="{{ props.id }}"
            :placeholder="props.placeholder" autocomplete="off" v-model="searchString" @keyup="searchImage" />

        <span class="invalid-feedback text-primary" role="alert">
            <strong>{{ errorMessage }}</strong>
        </span>
        <div class="mt-3 bg-white rounded" v-if="availableItems.data">
            <!-- Add title here -->
            <div class="px-2 py-3 bg-green-200 text-black rounded-t">
                <strong>Available Items</strong>
            </div>
            <div class="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4 border-l-transparent hover:rounded text-black hover:bg-green-700 hover:text-white"
                v-for="(item, index) in availableItems.data" :key="item.id" @click="addItem(item)">
                <div class="inline-flex items-center space-x-2">
                    <div><strong>{{ item[props.displayKey] }}</strong></div>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Show the selected items -->
        <div class="mt-3 bg-white rounded">
            <div class="flex justify-between items-center border-b border-slate-200 text-black py-3 px-2 border-l-4 border-l-transparent hover:rounded hover:bg-red-700 hover:text-white"
                v-for="(item, index) in selectedItem" :key="item.id" @click="removeItem(index)">
                <div class="inline-flex items-center space-x-2">
                    <div><strong>{{ item[props.displayKey] }}</strong></div>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
import { usePage } from "@inertiajs/vue3";

let errorMessage = $ref(null);

watch(
    () => usePage().props?.errors,
    (v) => {
        if (usePage().props.errors[props.name]) {
            errorMessage = usePage().props.errors[props.name];
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
    displayKey: {
        type: String,
        default: "name",
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
            [props.displayKey]: item[props.displayKey],
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

