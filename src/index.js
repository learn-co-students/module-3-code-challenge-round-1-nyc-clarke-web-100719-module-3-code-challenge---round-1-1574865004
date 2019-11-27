const imageId = 4057 //Enter the id from the fetched image here
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`


let comments
let likesCount = 0
let spanLikes
const imageCard = document.getElementById('image_card')
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
  likesCount = obj.like_count
  const imagHTML = `<img src=${obj.url} id="image" data-id=${obj.id}/>
  <h4 id="name">${obj.name}</h4>
  <span>Likes:
  <span id="likes">${likesCount}</span>
  </span>
  <button id="like_button" data-img-id=${obj.id}>Like</button>
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
    const cmHTML = `<li data-comment-id=${comment.id}> ${comment.content} </li>`
    comments.innerHTML += cmHTML
}

imageCard.addEventListener('click', e =>{
  e.preventDefault()
  console.log(e.target)
  if(e.target.id === "like_button"){ // check if like_button
    updateLikes() // optimi.. approach
    persistLike()
  }
  else if(e.target.value === "Submit"){
    const comment = document.getElementById('comment_input')
    optCommentRender(comment.value)
    persistComment(comment.value)
    comment.parentNode.reset()
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
    })})   // optim.. approach
}
//
getImage()