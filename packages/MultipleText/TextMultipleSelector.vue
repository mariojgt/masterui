<template>
    <div class="form-control">
        <label class="label">
            <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
        </label>

        <!-- Search Input with Icon -->
        <div class="relative">
            <input
                class="input input-primary input-bordered w-full pl-10"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                autocomplete="off"
                v-model="searchString"
                @keyup="searchImage"
            />
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>

        <!-- Error Message -->
        <span class="invalid-feedback text-primary mt-1 block" role="alert" v-if="errorMessage">
            <strong>{{ errorMessage }}</strong>
        </span>

        <!-- Available Items -->
        <div v-if="availableItems.data" class="mt-3 rounded-lg overflow-hidden border border-base-300 bg-base-100 shadow-lg">
            <div class="px-4 py-3 text-xl font-bold bg-primary text-white">
                <strong class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Available Items
                </strong>
            </div>
            <div class="p-2 space-y-2">
                <div v-for="(item, index) in availableItems.data"
                     :key="item.id"
                     @click="addItem(item)"
                     class="flex justify-between items-center p-3 bg-white rounded-lg border border-base-200 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-200 cursor-pointer">
                    <p class="text-xl font-bold text-black">{{ item[props.displayKey] }}</p>
                    <div class="btn btn-circle btn-success btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Items -->
        <div v-if="selectedItem.length > 0" class="mt-3 rounded-lg overflow-hidden border border-base-300 bg-base-100 shadow-lg">
            <div class="px-4 py-3 text-xl font-bold bg-secondary text-white">
                <strong class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Selected Items
                </strong>
            </div>
            <div class="p-2 space-y-2">
                <div v-for="(item, index) in selectedItem"
                     :key="item.id"
                     class="flex justify-between items-center p-3 bg-white rounded-lg border border-base-200 hover:bg-base-200 transition-all duration-200">
                    <p class="text-xl font-bold">{{ item[props.displayKey] }}</p>
                    <div class="btn btn-circle btn-error btn-sm" @click="removeItem(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
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
let searchString = ref("");
let availableItems = ref([]);
let selectedItem = ref([]);

watch(
    () => usePage().props?.errors,
    (v) => {
        if (usePage().props.errors[props.name]) {
            errorMessage.value = usePage().props.errors[props.name];
        }
    }
);

const props = defineProps({
    label: { type: String, default: "" },
    name: { type: String, default: "" },
    id: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    model: { type: String, default: "" },
    columns: { type: Object, default: null },
    endpoint: { type: String, default: "" },
    loadData: { type: Object, default: null },
    singleMode: { type: Boolean, default: false },
    displayKey: { type: String, default: "name" },
});

const emit = defineEmits(["update:modelValue"]);

const update = (event) => {
    emit("update:modelValue", event.target.value);
};

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

const addItem = (item) => {
    if (props.singleMode) {
        selectedItem.value = [];
    }
    if (!Array.isArray(selectedItem.value)) {
        selectedItem.value = [];
    }
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
