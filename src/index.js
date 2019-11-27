console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

//variables
let imageId = 4053
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`
const commentsList = document.querySelector('#comments')
const likeButton = document.querySelector('#like_button')
const likes = document.querySelector('#likes')
const commentForm = document.querySelector('#comment_form')
let imageHTML = document.querySelector('#image')
let imageName = document.querySelector('#name')

//render image
fetch(`https://randopic.herokuapp.com/images/${imageId}`)
  .then(response => response.json())
  .then(data => {
    renderImage(data)
  })
  .catch(err => err.message)

function renderImage(image) {
  imageHTML.src = image.url
  imageName.innerHTML = image.name
  likes.innerHTML = image.like_count
  image.comments.forEach(comment => {
    renderComment(comment)
  });
};

//Like button listens for likes & persists in backend
likeButton.addEventListener('click', function(event) {
  let currentLikes = parseInt(likes.innerHTML)
  let newLikes = likes.innerHTML = currentLikes + 1
  fetch('https://randopic.herokuapp.com/likes', {
    method: 'POST',
    body: JSON.stringify({image_id: imageId}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })  
});

//comment form listens for newly submitted comments & persists in backend
commentForm.addEventListener('submit', function(event) {
  event.preventDefault()
  let commentData = {}
  Array.from(event.target.children).forEach(function (input) {
    if (input.name) {
      commentData[input.name] = input.value
    } 
  });
  fetch('https://randopic.herokuapp.com/comments', {
    method: 'POST',
    body: JSON.stringify({
      image_id: imageId,
      content: commentData.comment
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      renderComment(data)
    })
    .catch(err => err.message)
});

//function to render comments - existing and new
function renderComment(comment) {
  let commentHTML = `
    <div>
    <li>${comment.content}</li><button class="delete-button" id=${comment.id}>Delete</button>
    </div>
  `
  commentsList.insertAdjacentHTML('beforeend', commentHTML)
};

//deleting comments in frontend & backend
commentsList.addEventListener('click', function(event) {
  if (event.target.className === "delete-button") {
    let buttonId = document.getElementById(`${event.target.id}`)
    fetch(`https://randopic.herokuapp.com/comments/${buttonId.id}`, {
    method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      buttonId.closest('div').remove()
    })
    .catch(err => err.message) 
   }
});