document.addEventListener('DOMContentLoaded', () => {
  let imageId = 4056;
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`;
  const likeURL = `https://randopic.herokuapp.com/likes/`;
  const commentsURL = `https://randopic.herokuapp.com/comments/`;
  fetchData();
  likeButtonListener();
  commentFormListener();
})

function fetchData() {
  return fetch("https://randopic.herokuapp.com/images/4056")
    .then(function(resp){
      return resp.json();
    })
    .then(function(data){
      renderData(data);
    })
}

function renderData(data) {
  let image = document.querySelector("#image");
  image.src = `${data.url}`;
  let imageTitle = document.querySelector("#name");
  imageTitle.innerText = `${data.name}`;
  let likes = document.querySelector("#likes");
  likes.innerText = `${data.like_count}`;
  let commentsUl = document.querySelector("#comments");
  let comments = data.comments;
  comments.forEach(function(el){
    let oneComment =`<li id=${el.id}>${el.content}</li>`;
    commentsUl.innerHTML += oneComment
  })
}

function likeButtonListener() {
  const likeButton = document.querySelector("#like_button");
  likeButton.addEventListener("click", function(event){
    let likes = document.querySelector("#likes");
    let likesCount = parseInt(likes.innerHTML);
    likesCount += 1;
    likes.innerHTML = likesCount;
    updateLikesBackend(likesCount);
  })
}

function updateLikesBackend(likesCount) {
  fetch("https://randopic.herokuapp.com/likes", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image_id: 4056,
      likes_count: likesCount,
    })
  })
}

function commentFormListener() {
  let commentCounter = 70046;
  let commentForm = document.querySelector("#comment_form");
  let commentInput = document.querySelector("#comment_input");
  let commentsUl = document.querySelector("#comments");
  commentForm.addEventListener("submit", function(event){
    event.preventDefault();
    let newComment = `<li id=${commentCounter + 1}>${commentInput.value}</li>`;
    let newCommentText = `${commentInput.value}`
    commentsUl.innerHTML += newComment;
    commentForm.reset();
    updateCommentsBackend(newCommentText);
  })
}

function updateCommentsBackend(newComment) {
  fetch("https://randopic.herokuapp.com/comments", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image_id: 4056,
      content: newComment,
    })
  })
}




