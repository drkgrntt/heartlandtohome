import { Blog } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import { useUser } from '@/context'
import keys from '@/keys'
import { SectionStandard } from '@/components'

const BlogShow = (props: { blog: Blog }) => {
  const { currentUser } = useUser()
  const [blog, setBlog] = useState(props.blog || {})
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
  }, [currentUser])

  const renderDate = () => {
    const date =
      blog.isPublished && blog.publishedAt
        ? blog.publishedAt
        : blog.createdAt

    return <p>{moment(date).format('MMMM Do, YYYY')}</p>
  }

  return (
    <SectionStandard
      posts={[blog]}
      enableCommenting={true}
      path="blog"
      apiPath="/api/blogs"
      redirectRoute="/blog/all"
      afterTitle={renderDate}
    />
  )
}

BlogShow.getInitialProps = async ({
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

export default BlogShow
