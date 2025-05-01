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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}