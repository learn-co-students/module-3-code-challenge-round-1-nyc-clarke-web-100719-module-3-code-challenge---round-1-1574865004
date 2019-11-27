document.addEventListener('DOMContentLoaded', () => {
  const imageNameDiv = document.querySelector('#name'),
       imageDiv = document.querySelector('#image'),
       likesCounter = document.querySelector('#likes'),
       likeButton = document.querySelector('#like_button'),
       commentForm = document.querySelector('#comment_form'),
       commentsList = document.querySelector('#comments')
  let imageId = 4050 //Entered the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  function fetchImage() {
    fetch(imageURL)
      .then(resp => resp.json())
      .then(function(data) {
        renderImage(data)
      })
      .catch(function(error) {
        alert(error)
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
      <li data-comment-id="${commentData.id}">${commentData.content} <button class="delete_button btn btn-sm btn-danger">Delete</button></li>
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
      .catch(function(error) {
        alert(error)
      })
      // optimistic rendering, so not doing anything with response.
  }

  function commentFormListener() {
    commentForm.addEventListener('submit', addComment)
  }

  function addComment(e) {
    e.preventDefault()
    const commentText = e.target.querySelector('#comment_input').value
    // changing to pesimistic rendering for the bonus
    // const commentHTML = `
    //     <li>
    //       ${commentText}
    //     </li>
    // `
    // commentsList.insertAdjacentHTML('beforeend', commentHTML) //optimistic rendering
    if (commentText === "") {
      alert("You cannot submit an empty comment!")
    } else {
      addCommentToBackend(commentText)
    }
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
      .then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
          return resp.json()
        } else {
          let err = new Error(resp.statusText)
          err.response = resp
          throw err
        }
      })
      .then(function(data) {
        commentsList.insertAdjacentHTML('beforeend', generateCommentHTML(data))
        commentForm.reset()
      })
      .catch(function(error) {
        alert(error)
      })
      // changed to pessimistic rendering
  }

  function deleteButtonListener() {
    commentsList.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete_button')) {
        let result = confirm("Are you sure you want to delete this comment?")
        if (result) {
          deleteComment(parseInt(e.target.closest('li').dataset.commentId))
        }
      }
    })
  }

  function deleteComment(commentId) {
    const commentObj = {
      method: "DELETE"
    }

    fetch(commentsURL + `${commentId}`, commentObj)
    .then(resp => resp.json())
    .then(function(data) {
      if (data.message === 'Comment Successfully Destroyed') {
        const deletedComment = commentsList.querySelector(`[data-comment-id="${commentId}"]`)
        deletedComment.remove()
      } else {
        alert(data.message)
      }
    })
    .catch(function(error) {
      alert(error)
    })

  }
  
  fetchImage()
  likeButtonListener()
  commentFormListener()
  deleteButtonListener()

})
