import vine from '@vinejs/vine'

/**
 * Validates the blog's creation action
 */
export const createBlogValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const blog = await db.from('blogs').where('name', value).first()
        return !blog
      }),
    published: vine.boolean(),
  })
)

/**
 * Validates the blog's update action
 */
export const updateBlogValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const blog = await db
          .from('blogs')
          .whereNot('id', field.meta.blogId)
          .where('name', value)
          .first()
        return !blog
      }),
    published: vine.boolean(),
  })
)
