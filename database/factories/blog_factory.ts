import factory from '@adonisjs/lucid/factories'
import Blog from '#models/blog'

export const BlogFactory = factory
  .define(Blog, async ({ faker }) => {
    return {}
  })
  .build()