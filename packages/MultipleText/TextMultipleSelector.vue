<template>
    <div class="form-control">
        <label class="label">
            <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
        </label>

        <input class="input input-primary input-bordered" :name="props.name" :id="props.id"
            :placeholder="props.placeholder" autocomplete="off" v-model="searchString" @keyup="searchImage" />

        <span class="invalid-feedback text-primary" role="alert">
            <strong>{{ errorMessage }}</strong>
        </span>
        <div v-if="availableItems.data" class="mt-3 rounded p-1 bg-base-100">
            <!-- Add title here -->
            <div class="px-2 py-3 text-xl font-bold bg-primary text-white rounded mb-2 text-left">
                <strong>Available Items</strong>
            </div>
            <div class="flex justify-between items-center text-black p-2 bg-white rounded-lg hover:bg-secondary border border-black mb-2"
                v-for="(item, index) in availableItems.data" :key="item.id" @click="addItem(item)">
                <p class="text-2xl font-bold text-black">{{ item[props.displayKey] }}</p>
                <div class="btn btn-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            </div>
        </div>
        <!-- Show the selected items -->
        <div v-if="selectedItem.length > 0" class="mt-3 rounded p-1 bg-base-100">
            <div class="px-2 py-3 text-xl bg-secondary text-white rounded mb-2 text-left">
                <strong>Selected Items</strong>
            </div>
            <div class="flex justify-between items-center text-black p-2 bg-white rounded-lg hover:bg-secondary border border-black mb-2"
                v-for="(item, index) in selectedItem" :key="item.id">
                <p class="text-2xl font-bold text-black">{{ item[props.displayKey] }}</p>
                <div class="btn btn-error" @click="removeItem(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { watch, onMounted, defineEmits, ref } from "vue";
import { usePage } from "@inertiajs/vue3";

let errorMessage = ref(null);

watch(
    () => usePage().props?.errors,
    (v) => {
        if (usePage().props.errors[props.name]) {
            errorMessage.value = usePage().props.errors[props.name];
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

let searchString = ref("");
let availableItems = ref([]);
const searchImage = async () => {
    axios
        .post(props.endpoint, {
            search: searchString.value,
            model: props.model,
            columns: props.columns,
        })
        .then(function (response) {
            availableItems.value = response.data;
        })
        .catch(function (error) {
            for (const [key, value] of Object.entries(
                error.response.data.errors
            )) {
                message.error(value[0]);
            }
        });
};

let selectedItem = ref([]);

const addItem = (item) => {
    if (props.singleMode) {
        selectedItem.value = [];
    }
    if (!Array.isArray(selectedItem.value)) {
        selectedItem.value = [];
    }
    // Add the image to the selected media make sure is unique value
    if (selectedItem.value.findIndex((i) => i.id === item.id) === -1) {
        selectedItem.value.push({
            id: item.id,
            [props.displayKey]: item[props.displayKey],
        });
    }
    availableItems.value = [];

    emit("update:modelValue", selectedItem.value);
};

const removeItem = (index) => {
    selectedItem.value.splice(index, 1);

    emit("update:modelValue", selectedItem.value);
};

onMounted(() => {
    if (props.loadData) {
        if (props.singleMode) {
            selectedItem.value = [props.loadData];
        } else {
            selectedItem.value = props.loadData;
        }
    }
});
</script>
