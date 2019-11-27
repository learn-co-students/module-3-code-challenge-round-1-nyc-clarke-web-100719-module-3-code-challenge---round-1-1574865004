const imageContainer = document.querySelector('div#image_card');
let commentList = document.querySelector('ul#comments');


document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4052

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetchProfile(imageURL, imageId);
  imageContainer.addEventListener('click', function(event){
    if (event.target.id === 'like_button') {
      document.querySelector('span#likes').innerText = parseInt(document.querySelector('span#likes').innerText) + 1;
      sendLikeDataUpdate(likeURL, imageId);
    } else if (event.target.id === 'submit') {
      event.preventDefault();
      let name = document.querySelector('input#comment_input');
      let form = document.getElementById('comment_form')
      updateCommentsBar(commentsURL, imageId, name.value);
      commentList.innerHTML += `<li>${name.value}</li>`;
      form.reset();
    } else if (event.target.id === 'delete-button') {
      alert('had i gotten frontend displaying what is being persisted to the backend, I would have changed the comment flow from optimistic to pessimistic rendering, and stored comments with their ids and used them to make the delete work properly')
    }
  })
})

function fetchProfile(imageURL, imageId) {
  fetch(imageURL)
    .then(function(response){
      return response.json()
    })
    .then(function(profile){
      renderProfile(profile)
    })
}

function renderProfile(profile) {
  let profileImage = document.getElementById('image')
  profileImage.src = profile.url;
  profileImage.dataset.id = profile.id;
  document.getElementById('name').innerText = profile.name;
  document.querySelector('span#likes').innerText = profile.like_count;
  commentList.innerHTML += `<li>${profile.comments[0].content}</li><button id="delete-button" data-id=${profile.comments[0].id}>Delete Comment</button>`;
}



function sendLikeDataUpdate(likeURL, imageId) {
  fetch(likeURL, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId
    })
  })
}

function updateCommentsBar(commentsURL, imageId, content) {
  fetch(commentsURL, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "image_id": imageId,
      "content": content
    })
  })
  .then(function(response){
    return response.json()
  })
  .then(function(object){
    debugger;
  })
}