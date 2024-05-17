import Blog from '#models/blog'
import { createBlogValidator, updateBlogValidator } from '#validators/blog'
import type { HttpContext } from '@adonisjs/core/http'

export default class BlogsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request, response }: HttpContext) {
    const blogs = await Blog.all() // add pagination later on
    const headers = request.headers()
    if (
      !headers['x-inertia'] &&
      headers['content-type'] &&
      headers['content-type'].toLowerCase() === 'application/json'
    ) {
      return response.send({ blogs })
    }
    return inertia.render('blogs/index', { blogs })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createBlogValidator)
    await Blog.create(payload)
    response.status(201).send('')
  }

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateBlogValidator, {
      meta: {
        blogId: params.id,
      },
    })
    const blog = await Blog.findOrFail(params.id)
    await blog.merge(payload).save()
    response.status(200).send({ blog })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const blog = await Blog.findOrFail(params.id)
    await blog.delete()
    response.status(200).send('')
  }
}
