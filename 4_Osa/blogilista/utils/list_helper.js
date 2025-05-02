const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((faveBlog, currentBlog) => {
    if (!faveBlog) {
      return currentBlog
    }
    if (currentBlog.likes > faveBlog.likes) {
    return currentBlog
    } else {
    return faveBlog
    }
  }, null)
return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const authorBlogCount = {}
  blogs.forEach(blog => {
    authorBlogCount[blog.author] = (authorBlogCount[blog.author] || 0) + 1 
  })

  let mostBlogs = 0
  let authorWithMostBlogs = ''

  for (const author in authorBlogCount) {
    if (authorBlogCount[author] > mostBlogs) {
      mostBlogs = authorBlogCount[author]
      authorWithMostBlogs = author
    }
  }

  return {
    author: authorWithMostBlogs,
    blogs: mostBlogs
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const authorLikeCount = {}
  blogs.forEach(blog => {
    authorLikeCount[blog.author] = (authorLikeCount[blog.author] || 0) + blog.likes 
  })

  let mostLikes = 0
  let authorWithMostLikes = ''

  for (const author in authorLikeCount) {
    if (authorLikeCount[author] > mostLikes) {
      mostLikes = authorLikeCount[author]
      authorWithMostLikes = author
    }
  }

  return {
    author: authorWithMostLikes,
    likes: mostLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}