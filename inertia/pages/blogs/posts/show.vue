<template>
  <Head title="Post" />

  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
        <div class="flex items-center m-2 ml-auto justify-between">
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ post.title }}</h2>
          <div>
            <Link
              class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
              href="/blogs"
            >
              Blogs
            </Link>
            <Link
              class="inline-flex items-center px-4 py-2 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-5 no-underline"
              :href="`/blogs/${blogId}/posts`"
            >
              Back
            </Link>
          </div>
        </div>
        <div class="m-4" v-html="post.description"></div>
        <div class="mt-4" v-if="allLinkMetaDetails.length > 0">
          <label class="block text-sm font-medium text-gray-700 mt-2" for="externalLink"
            >External links</label
          >
          <div class="url-preview text-xs flex flex-wrap">
            <div
              v-for="(detail, index) in allLinkMetaDetails"
              :key="index"
              class="url-card border border-gray-300 rounded-lg m-4 p-4 flex flex-col"
            >
              <div class="url-info mb-2">
                <div class="url-title font-bold">
                  {{ detail.title }}
                </div>
                <div class="url-site text-gray-600">
                  {{ detail.siteName }}
                </div>
                <div class="url-description">
                  {{ detail.description }}
                </div>
              </div>
              <div class="url-image flex justify-center" v-if="detail.image">
                <img :src="detail.image" alt="URL Preview" class="max-w-40 h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3'
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  post: {
    type: Object,
  },
  blogId: {
    type: String,
  },
})
const allLinkMetaDetails = ref([])
const fetchAndDisplayMetadata = async (url) => {
  let details = { url }
  // Below call can be implemented on server side for scraping meta data of links but for demo purpose and getting job done using https://meta.mehari.workers.dev
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

const setMetaLinkDetails = async (content) => {
  const newMetaDetails = []
  const urls = extractUrlsFromStringWithHtml(content)
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

onMounted(() => {
  setMetaLinkDetails(props.post.description)
})
</script>
