import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const post = await db
          .from('posts')
          .where('blog_id', field.meta.blogId)
          .where('title', value)
          .first()
        return !post
      }),
    description: vine.string().trim(),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const post = await db
          .from('posts')
          .where('title', value)
          .where('blog_id', field.meta.blogId)
          .whereNot('id', field.meta.postId)
          .first()
        return !post
      }),
    description: vine.string().trim(),
  })
)
