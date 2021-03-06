import { Post } from '@/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Error from 'next/error'
import axios from 'axios'
import { useUser } from '@/context'
import { PostsForm } from '@/components'
import keys from '@/keys'

const PostsEdit = (props: { post: Post }) => {
  const { currentUser } = useUser()
  const { query } = useRouter()
  const [post, setPost] = useState(props.post)
  useEffect(() => {
    const resetPost = async () => {
      if (currentUser?.isAdmin) {
        const { data: foundPost } = await axios.get(
          `/api/posts/${query.id}`
        )
        setPost(foundPost)
      }
    }
    resetPost()
  }, [currentUser])

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="Edit Post"
      post={post}
      apiEndpoint={`/api/posts/${post.id}`}
      editing
    />
  )
}

PostsEdit.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: post } = await axios.get(
      `${rootUrl}/api/posts/${query.id}`
    )

    return { post }
  } catch (err: any) {
    return {}
  }
}

export default PostsEdit
