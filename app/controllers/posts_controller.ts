import Blog from '#models/blog'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'fs'
import { request } from 'http'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, params, logger, request, response }: HttpContext) {
    const blogId = params.blog_id
    const headers = request.headers()
    const posts = await Post.query().where('blog_id', blogId).orderBy('id', 'desc')
    const postsJSON = posts.map((post) => post.serialize())
    console.log(headers)
    if (
      !headers['x-inertia'] &&
      headers['content-type'] &&
      headers['content-type'].toLowerCase() === 'application/json'
    ) {
      return response.send({ posts: postsJSON })
    }
    return inertia.render('blogs/posts/index', { posts: postsJSON, blogId })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, params, logger }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const blogId = params.blog_id
    const post = await Post.create({ ...payload, blog_id: blogId })

    return response.status(201).send({ post })
  }

  /**
   * Show individual record
   */
  async show({ params, inertia, request, response }: HttpContext) {
    const post = (await Post.findOrFail(params.id)).serialize()
    const headers = request.headers()
    if (
      !headers['x-inertia'] &&
      headers['content-type'] &&
      headers['content-type'].toLowerCase() === 'application/json'
    ) {
      return response.send({ post })
    }
    return inertia.render('blogs/posts/show', {
      post,
      blogId: params.blog_id,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, inertia }: HttpContext) {
    const payload = await request.validateUsing(updatePostValidator, {
      meta: {
        postId: params.id,
      },
    })
    const post = await Post.findOrFail(params.id)
    await post.merge(payload).save()
    return response.status(200).send({ post })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.status(200).send('')
  }

  // /**
  //  * Image upload
  //  */
  async imageUpload({ params, response, request }: HttpContext) {
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
    })
    if (image) {
      if (!image.isValid) {
        return response.badRequest({
          errors: image.errors,
        })
      }
      await image.move(app.makePath('uploads'), {
        name: `${cuid()}.${image.extname}`,
      })
    }
    return response.status(200).send({ imageUrl: `/uploads/${image?.fileName}` })
  }
}
