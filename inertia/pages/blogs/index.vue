<template>
  <Head title="Blogs" />

  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
        <div role="alert" v-if="data.errorMessage">
          <div class="border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{{ data.errorMessage }}</p>
          </div>
        </div>
        <div class="flex items-center m-2 ml-auto justify-between">
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Blogs</h2>
          <button
            class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5"
            @click="openCreateModal"
          >
            create new blog
          </button>
        </div>
        <div v-if="blogs.length">
          <div class="blogs-list">
            <div v-for="(blog, index) in blogs" :key="blog.id">
              <div class="flex items-center justify-between py-2 hover:bg-gray-50">
                <Link
                  :href="`/blogs/${blog.id}/posts`"
                  class="flex flex-1 no-underline text-gray-800"
                >
                  <div class="flex-1">{{ blog.name }}</div>
                </Link>
                <div class="mr-4">
                  <label class="inline-flex items-center cursor-pointer">
                    <span class="">{{ blogs[index].published ? 'Published' : 'Draft' }}</span>
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="blogs[index].published"
                      @change="updateStatus(blog)"
                      :true-value="1"
                      :false-value="0"
                    />
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ml-4"
                    ></div>
                  </label>
                </div>
                <div class="inline-flex">
                  <button
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    @click="editBlog(blog)"
                  >
                    Edit
                  </button>
                  <button
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                    @click="deleteBlog(blog)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal v-if="showModal" @close-modal="closeModal">
    <template #header>
      <div class="flex justify-between items-center px-4 py-2">
        <h2 class="text-lg font-bold">{{ mode === 'edit' ? 'Edit' : 'Create' }} Blog</h2>
        <button @click="closeModal" class="text-blue-600 hover:text-blue-800">&times;</button>
      </div>
    </template>
    <template #body>
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="title"
          v-model="formData.name"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <div class="mt-1 flex">
          <label for="status" class="mr-2 block text-sm text-gray-900">Published</label>
          <input
            type="checkbox"
            id="status"
            v-model="formData.published"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            :true-value="1"
            :false-value="0"
          />
        </div>
      </div>
      <div class="px-4 py-2 flex justify-end">
        <slot name="footer">
          <button
            @click="closeModal"
            class="mr-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="handleSubmit"
          >
            {{ mode === 'edit' ? 'Update' : 'Save' }}
          </button>
        </slot>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { Head, usePage, Link } from '@inertiajs/vue3'
import axios from 'axios'
import { reactive, ref, watch } from 'vue'
import Modal from '../../components/modal.vue'
import { router } from '@inertiajs/vue3'
import { nextTick } from 'process'

defineProps({
  blogs: {
    type: Array,
  },
})

const data = reactive({
  loading: false,
  errorMessage: '',
})

const showModal = ref(false)
const formData = ref({
  name: '',
  published: 0,
})
const mode = ref('create') // Initial mode is 'create'

const resetForm = () => {
  formData.value = { name: '', published: 0 } // Clear the form for new creation
  mode.value = 'create' // Set mode to 'create'
}
const openCreateModal = () => {
  resetForm()
  openModal() // Open the modal for creating a new blog
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const editBlog = (blog) => {
  formData.value = { ...blog } // Fill the form with the blog data for editing
  mode.value = 'edit' // Set the mode to 'edit'
  openModal() // Open the modal for editing
}

const deleteBlog = async (blog) => {
  let isConfirmed = confirm('Are you sure, you want to delete this blog?')
  if (!isConfirmed) {
    return
  }

  try {
    await axios.delete(`/blogs/${blog.id}`)
    router.reload({ only: ['blogs'] })
    alert('Blog deleted successfully.')
  } catch (error) {
    console.log(error)
    data.loading = false
    data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
  }
}

const updateBlog = async () => {
  await axios
    .put(`/blogs/${formData.value.id}`, formData.value)
    .then((response) => {
      router.reload({ only: ['blogs'] })
      resetForm()
      data.loading = false
    })
    .catch((error) => {
      console.log(error)
      data.loading = false
      data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
    })
}

const handleSubmit = async () => {
  if (mode.value === 'edit') {
    // Handle update logic
    await updateBlog()
  } else {
    // Handle create logic
    await axios
      .post(`/blogs`, formData.value)
      .then((response) => {
        router.reload({ only: ['blogs'] })
        data.loading = false
      })
      .catch((error) => {
        console.log(error)
        data.loading = false
        data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
      })
  }
  closeModal()
}

const updateStatus = async (blog) => {
  formData.value = { ...blog }
  await updateBlog()
}
</script>
