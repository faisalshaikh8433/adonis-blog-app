/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import BlogsController from '#controllers/blogs_controller'
import PostsController from '#controllers/posts_controller'

router.get('/', [BlogsController, 'index'])
router.resource('blogs', BlogsController)
router.resource('blogs.posts', PostsController)
router.post('blogs/:blog_id/posts/:id', [PostsController, 'imageUpload'])
router.on('/inertia').renderInertia('home', { version: 6 })
const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
