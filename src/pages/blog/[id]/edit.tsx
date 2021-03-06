import { Blog } from '@/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Error from 'next/error'
import axios from 'axios'
import { useUser } from '@/context'
import { PostsForm } from '@/components'
import keys from '@/keys'

const BlogEdit = (props: { blog: Blog }) => {
  const { currentUser } = useUser()
  const [blog, setBlog] = useState(props.blog || [])
  const { query } = useRouter()

  useEffect(() => {
    if (currentUser?.isAdmin) {
      const getBlog = async () => {
        const { data: blog } = await axios.get(
          `/api/blogs/${query.id}`
        )
        setBlog(blog)
      }
      getBlog()
    }
  }, [])

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="Edit Blog Post"
      post={blog}
      apiEndpoint={`/api/blogs/${blog.id}`}
      redirectRoute="/blog/all"
      editing
    />
  )
}

BlogEdit.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: blog } = await axios.get(
      `${rootUrl}/api/blogs/${query.id}`
    )

    return { blog }
  } catch (err: any) {
    return {}
  }
}

export default BlogEdit
