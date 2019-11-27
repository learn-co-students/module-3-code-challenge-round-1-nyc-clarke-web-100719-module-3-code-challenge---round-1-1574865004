document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  const imageNameDiv = document.querySelector('#name')
  const imageDiv = document.querySelector('#image')
  const likesCounter = document.querySelector('#likes')
  const likeButton = document.querySelector('#like_button')
  const commentForm = document.querySelector('#comment_form')
  const commentsList = document.querySelector('#comments')
  let imageId = 4050 //Entered the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  function fetchImage() {
    fetch(imageURL)
      .then(resp => resp.json())
      .then(function(data) {
        renderImage(data);
      })
  }

  function renderImage(imageData) {
    imageNameDiv.innerText = imageData.name
    imageDiv.src = imageData.url
    likesCounter.innerText = imageData.like_count
    imageData.comments.forEach(function(comment) {
      commentsList.insertAdjacentHTML('beforeend', generateCommentHTML(comment))
    })
  }

  function generateCommentHTML(commentData) {
    const commentHTML = `
      <li data-comment-id="${commentData.id}">
        ${commentData.content}
      </li>
    `
    return commentHTML
  }

  function likeButtonListener() {
    likeButton.addEventListener('click', addLike)
  }

  function addLike() {
    likesCounter.innerText = parseInt(likesCounter.innerText) + 1 // optimistic rendering
    addLikeToBackend()
  }

  function addLikeToBackend() {
    const likeObj = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId
      })
    }
    fetch(likeURL, likeObj)
      // optimistic rendering, so not doing anything with response.
  }

  function commentFormListener() {
    commentForm.addEventListener('submit', addComment)
  }

  function addComment(e) {
    e.preventDefault()
    const commentText = e.target.querySelector('#comment_input').value
    const commentHTML = `
        <li>
          ${commentText}
        </li>
    `
    commentsList.insertAdjacentHTML('beforeend', commentHTML) //optimistic rendering
    commentForm.reset()
    addCommentToBackend(commentText)
  }

  function addCommentToBackend(commentText) {
    const commentObj = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: commentText
      })
    }
    fetch(commentsURL, commentObj)
      // optimistic rendering, so not doing anything with response.
  }
  
  fetchImage()
  likeButtonListener()
  commentFormListener()

})
