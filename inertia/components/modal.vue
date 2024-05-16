<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
  >
    <div class="bg-white rounded-lg max-w-xl w-full">
      <div class="px-4 py-2">
        <slot name="header">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold">Modal Header</h2>
            <button @click="closeModal" class="text-gray-600 hover:text-gray-800">&times;</button>
          </div>
        </slot>
        <div class="p-4 overflow-y-auto max-h-[500px]">
          <slot name="body">
            <p>This is the default body content.</p>
          </slot>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    openHtmlModal: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const showModal = ref(true)

    const openModal = () => {
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    return {
      showModal,
      openModal,
      closeModal,
    }
  },
}
</script>

<style scoped>
/* Modal styles */
/* Tailwind CSS classes are used directly in the template */
</style>
