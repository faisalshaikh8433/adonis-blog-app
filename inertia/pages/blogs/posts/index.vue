<template>
  <Head title="Posts" />
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
        <div class="flex items-center m-2 ml-auto justify-between">
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Posts</h2>
          <div>
            <button
              class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5"
              @click="openCreateModal"
            >
              create new post
            </button>
            <Link
              class="inline-flex items-center px-4 py-2 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
              href="/blogs"
            >
              Back
            </Link>
          </div>
        </div>
        <div v-if="posts.length">
          <div class="posts-list">
            <div v-for="post in posts" :key="post.id" class="post-item">
              <div class="flex items-center py-2 hover:bg-gray-50">
                <Link
                  :href="`/blogs/${blogId}/posts/${post.id}`"
                  class="flex flex-1 no-underline text-gray-800"
                >
                  <div class="post-title">{{ post.title }}</div>
                </Link>
                <div class="inline-flex">
                  <button
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    @click="editPost(post)"
                  >
                    Edit
                  </button>
                  <button
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                    @click="deletePost(post)"
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
        <h2 class="text-lg font-bold">{{ mode === 'edit' ? 'Edit' : 'Create' }} Post</h2>
        <button @click="closeModal" class="text-blue-600 hover:text-blue-800">&times;</button>
      </div>
      <div role="alert" v-if="data.errorMessage">
        <div class="border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>{{ data.errorMessage }}</p>
        </div>
      </div>
    </template>
    <template #body>
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700" for="description">Description</label>
        <div class="mt-1">
          <textarea
            id="description"
            class="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            rows="3"
            cols="10"
            ref="descriptionRef"
          />
        </div>
      </div>
      <div class="mb-4" v-if="allLinkMetaDetails.length > 0">
        <label class="block text-sm font-medium text-gray-700" for="externalLink"
          >External links</label
        >
        <div class="url-preview text-xs flex flex-wrap">
          <div
            v-for="(detail, index) in allLinkMetaDetails"
            :key="index"
            class="url-card border border-gray-300 rounded-lg m-4 p-4 flex flex-col"
          >
            <div class="url-info mb-2">
              <div class="url-title font-bold">{{ detail.title }}</div>
              <div class="url-site text-gray-600">{{ detail.siteName }}</div>
              <div class="url-description">{{ detail.description }}</div>
            </div>
            <div class="url-image flex justify-center">
              <img :src="detail.image" alt="URL Preview" class="max-w-40 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="px-4 py-2 flex justify-end">
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
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3'
import axios from 'axios'
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import Modal from '../../../components/modal.vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
  posts: {
    type: Array,
  },
  blogId: {
    type: String,
  },
})

const data = reactive({
  loading: false,
  errorMessage: '',
})

const allLinkMetaDetails = ref([])

const showModal = ref(false)
const descriptionRef = ref(null)
const fileInput = ref(null)
const formData = ref({
  name: '',
  description: '',
})
const mode = ref('create') // Initial mode is 'create'

const resetForm = () => {
  formData.value = { name: '', description: '' } // Clear the form for new creation
  mode.value = 'create' // Set mode to 'create'
}
const openCreateModal = () => {
  resetForm()
  openModal() // Open the modal for creating a new post
}

const openModal = () => {
  showModal.value = true
  nextTick(() => {
    initTinyMce()
  })
}

const closeModal = () => {
  tinymce.activeEditor.remove('#description')
  showModal.value = false
}

const editPost = (post) => {
  formData.value = { ...post } // Fill the form with the post data for editing
  mode.value = 'edit' // Set the mode to 'edit'
  openModal() // Open the modal for editing
}

const deletePost = async (post) => {
  let isConfirmed = confirm('Are you sure, you want to delete this post?')
  if (!isConfirmed) {
    return
  }

  try {
    await axios.delete(`/blogs/${props.blogId}/posts/${post.id}`)
    router.reload({ only: ['posts'] })
    alert('Post deleted successfully')
  } catch (error) {
    console.log(error)
    data.loading = false
    data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
  }
}

const handleSubmit = async () => {
  data.errorMessage = ''
  const form = new FormData()
  form.append('title', formData.value.title)
  form.append('description', tinymce.activeEditor.getContent())
  if (mode.value === 'edit') {
    // Handle update logic
    await axios
      .put(`/blogs/${props.blogId}/posts/${formData.value.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        router.reload({ only: ['posts'] })
        resetForm()
        data.loading = false
        closeModal()
      })
      .catch((error) => {
        console.log(error)
        data.loading = false
        data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
      })
  } else {
    // Handle create logic
    await axios
      .post(`/blogs/${props.blogId}/posts`, form)
      .then((response) => {
        router.reload({ only: ['posts'] })
        data.loading = false
        closeModal()
      })
      .catch((error) => {
        console.log(error)
        data.loading = false
        data.errorMessage = error?.response?.data?.errors[0].message || 'Something went wrong' // display this message in error modal/space
      })
  }
}

const fetchAndDisplayMetadata = async (url) => {
  let details = { url }
  await axios
    .get('https://meta.mehari.workers.dev', { params: { url } })
    .then(({ data }) => {
      details = data
    })
    .catch((error) => {
      console.log(error)
    })
  return details
}

function extractUrlsFromStringWithHtml(input) {
  const extractedUrls = new Set()
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const tempElement = document.createElement('div')
  tempElement.innerHTML = input

  // Get all anchor elements
  const anchorElements = tempElement.getElementsByTagName('a')

  // Filter out external links from anchor elements
  Array.from(anchorElements).forEach((element) => {
    const href = element.getAttribute('href')
    if (href && href.match(urlRegex)) {
      extractedUrls.add(href)
    }
  })

  // Get text content of the input string
  const textContent = tempElement.textContent || tempElement.innerText

  // Match URLs in the text content using the regex
  const matches = textContent.match(urlRegex)

  if (matches) {
    extractedUrls.add(...matches)
  }

  return Array.from(extractedUrls)
}

// const allLinks = computed(() => {
//   return allLinkMetaDetails.value.map((meta) => meta.url)
// })
const initTinyMce = () => {
  console.log(descriptionRef.value)
  console.log(tinymce)
  try {
    tinymce.init({
      selector: '#description',
      plugins: 'link code image', // Include the necessary plugins: link, image, code
      toolbar: 'undo redo | formatselect | bold italic underline strikethrough | link code',
      images_upload_url: `blogs/${props.blogId}/posts/1`,
      automatic_uploads: false,
      setup: function (editor) {
        editor.on('init', (e) => {
          editor.setContent(formData.value.description)
          setMetaLinkDetails(editor)
        })
        editor.on('change', async (e) => {
          setMetaLinkDetails(editor)
          // // const newMetaDetails = []
          // console.log(editor.getContent())
          // const urls = extractUrlsFromStringWithHtml(editor.getContent())
          // console.log(urls)
          // // data.externalLinks = result
          // const newMetaDetails = urls.map(async (url) => {
          //   let metaDetails = allLinkMetaDetails.value.find((detail) => detail.url === url)
          //   console.log(metaDetails)
          //   if (metaDetails) {
          //     // newMetaDetails.push(metaDetails)
          //     return metaDetails
          //   }
          //   let metaDetail = await fetchAndDisplayMetadata(url)
          //   console.log(metaDetail, 'metaDetail')
          //   return metaDetail
          //   // newMetaDetails.push(metaDetail)
          // })
          // console.log(newMetaDetails, 'array')
          // allLinkMetaDetails.value = newMetaDetails
          // console.log('The TinyMCE rich text editor content has changed.')
          // console.log('The TinyMCE rich text editor content has changed.')
        })
      },
    })
  } catch (error) {
    console.error('Error initializing CKEditor:', error)
  }
}

const setMetaLinkDetails = async (editor) => {
  const newMetaDetails = []
  const content = editor.getContent()
  const urls = extractUrlsFromStringWithHtml(content)
  allLinkMetaDetails.value = []
  // Use Promise.all to wait for all fetchAndDisplayMetadata calls to resolve
  await Promise.all(
    urls.map(async (url) => {
      let metaDetails = allLinkMetaDetails.value.find((detail) => detail.url === url)

      if (metaDetails) {
        newMetaDetails.push(metaDetails)
      } else {
        let metaDetail = await fetchAndDisplayMetadata(url)
        newMetaDetails.push(metaDetail)
      }
    })
  )
  // After all promises are resolved, update the reactive property
  allLinkMetaDetails.value = newMetaDetails
}
</script>
<style scoped>
.preview-container {
  margin-top: 20px;
}

.preview-container img {
  max-width: 100%;
  height: auto;
}
</style>
