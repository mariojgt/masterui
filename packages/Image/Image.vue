<template>
    <div class="form-control">
        <label class="label">
            <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
        </label>

        <input class="input input-primary input-bordered" :name="props.name" :id="props.id"
            :placeholder="props.placeholder" v-model="searchString" autocomplete="off" @keyup="searchImage" />

        <span class="invalid-feedback text-primary" role="alert" v-if="errorMessage">
            <strong>{{ errorMessage }}</strong>
        </span>

        <div class="mt-3 bg-white rounded" v-if="availableSearchItems.data">
            <!-- Add title here -->
            <div class="px-2 py-3 bg-green-200 text-black rounded-t">
                <strong>Available Items</strong>
            </div>
            <div class="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4 border-l-transparent hover:rounded text-black hover:bg-green-700 hover:text-white"
                v-for="(item, index) in availableSearchItems.data" :key="item.id" @click="addMedia(item)">
                <div class="inline-flex items-center space-x-2">
                    <div>
                        <img :src="item.url.default" alt="" class="h-10 w-10 flex-shrink-0 rounded-full" />
                    </div>
                    <div><strong>{{ item.name }}</strong></div>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="mt-3 bg-white rounded" v-if="selectedMedia.length > 0">
            <!-- Add title here -->
            <div class="px-2 py-3 bg-red-200 text-black rounded-t">
                <strong>Selected Items</strong>
            </div>
            <div class="flex justify-between items-center border-b border-slate-200 text-black py-3 px-2 border-l-4 border-l-transparent hover:rounded hover:bg-red-700 hover:text-white"
                v-for="(item, index) in selectedMedia" :key="item.id" @click="removeMedia(index)">
                <div class="inline-flex items-center space-x-2">
                    <div>
                        <img :src="item.url.default" alt="" class="h-10 w-10 flex-shrink-0 rounded-full" />
                    </div>
                    <div><strong>{{ item.name }}</strong></div>
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
import { ref, watchEffect } from 'vue'
import axios from 'axios'

const props = defineProps({
  label: String,
  name: String,
  id: String,
  placeholder: String,
  modelValue: Array,
  endpoint: String,
  loadData: Object,
})

let searchString = ref('')
let availableSearchItems = ref({})
let selectedMedia = ref(props.modelValue || [])
let errorMessage = ref(null)

watchEffect(() => {
  selectedMedia.value = props.loadData || []
})

const emit = defineEmits(['update:modelValue'])

const searchImage = () => {
  axios.post(props.endpoint, { search: searchString.value })
    .then(response => {
      availableSearchItems.value = response.data
    })
    .catch(error => {
      errorMessage.value = error.message
    })
}

const addMedia = (item) => {
  if (!selectedMedia.value.find(media => media.id === item.id)) {
    selectedMedia.value.push(item)
    emit('update:modelValue', selectedMedia.value)
  }
  availableSearchItems.value = {}
}

const removeMedia = (index) => {
  selectedMedia.value.splice(index, 1)
  emit('update:modelValue', selectedMedia.value)
}
</script>

<style>

</style>
