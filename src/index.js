const imageId = 4057 //Enter the id from the fetched image here
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`


let comments, spanLikes
const imageCard = document.getElementById('image_card')

// function: fetch image and render page
function getImage(){ 
    fetch(imageURL)
      .then(res => res.json())
      .then(json =>{
        renderPage(json)
        comments = document.getElementById('comments')
        spanLikes = document.getElementById('likes')
        json.comments.forEach(renderComment)
      })
}

const renderPage = obj =>{
  const imagHTML = `<img  style="padding: 20px;" src=${obj.url} id="image" data-id=${obj.id}/>
  <h4 id="name">${obj.name}</h4>
  <span>Likes:
  <span id="likes">${obj.like_count}</span>
  </span>
  <button id="like_button" data-img-id=${obj.id}>Like</button>
  <hr>
  <form id="comment_form" data-img=${obj.id}>
    <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
    <input type="submit" value="Submit"/>
  </form>
  <ul id="comments">
  </ul>
  `
  imageCard.innerHTML = imagHTML
}

const renderComment = comment =>{
    const cmHTML = `<li style="padding: 5px 5px;" data-comment-id=${comment.id}> ${comment.content} <button style="padding: 5px 5px;" class="trash" data-comment-id=${comment.id}>🗑</button></li>`
    comments.innerHTML += cmHTML
}

imageCard.addEventListener('click', e =>{
  e.preventDefault()
  const comment = document.getElementById('comment_input')
    if(e.target.id === "like_button"){ // check if like_button
    updateLikes() // optimi.. approach
    persistLike()
    }
    else if(e.target.value === "Submit" && comment.value !== ""){
      //optCommentRender(comment.value) // previously used for optimistic approach
      persistComment(comment.value)
      comment.parentNode.reset()
    }
    else if(e.target.className == "trash"){
      DeleteComment(e.target.dataset.commentId)
    }
})

const updateLikes = () =>{
    spanLikes.innerHTML = parseInt(spanLikes.innerHTML) + 1
}

const persistLike = () =>{
  fetch(likeURL,{
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId
    })})   // optim.. approach
}
// previosly used for new comment rendering
const optCommentRender = comment =>{
  const cmHTML = `<li> ${comment} </li>`
    comments.innerHTML += cmHTML
}

const persistComment = (commentContent) => {
  fetch(commentsURL,{
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId,
      content: commentContent
    })})   // prev - optmistic app => present - pessimistic
    .then(res => res.json())
    .then(json =>{
          renderComment(json)
    })
    .catch(err =>{
      alert(err)
    })
}

  function DeleteComment(cmID){
    fetch(commentsURL + `${cmID}` ,{
      method: 'DELETE',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })   // pessimistic app
      .then(res => res.json())
      .then(json =>{
            removeComment(cmID)
      })
  }

  const removeComment = id =>{
    document.querySelector(`li[data-comment-id="${id}"`).remove()
  }
  
// Calling function to load page
getImage()