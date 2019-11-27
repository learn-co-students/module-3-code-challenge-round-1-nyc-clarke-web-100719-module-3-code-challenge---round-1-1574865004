
const URL = "https://randopic.herokuapp.com/images/4061";

function fetchData() {
  fetch(URL)
    .then(data => data.json())
    .then(renderData)
    .catch(console.error);
}

function renderData(objData) {
  let divCard = document.getElementsByClassName("card");
  divCard.dataset = objData.id;

  // console.log(divCard.dataset);

  const image = document.getElementById("image");
  image.src = objData.url;

  const h4Title = document.getElementById("name");
  h4Title.innerHTML = objData.name;

  const spanLikes = document.getElementById("likes");
  spanLikes.innerHTML = objData.like_count;

  if(objData.comments.length > 1) {
    objData.comments.forEach((objComment) => {
      renderComment(objComment);
    });
  } else {
    renderComment(objData.comments[0]);
  }
}

function renderComment(objComment) {
  const ulComments = document.getElementById("comments");
  const liComment = document.createElement("li");

  liComment.innerHTML = objComment.content;
  ulComments.appendChild(liComment);
}

function addLike() {
  const spanLikes = document.getElementById("likes");
  let divCard = document.getElementsByClassName("card");

  let likeData = {
    like_count: 2
  };

  let config = {
    method: "PATCH",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(likeData)
  };

  fetch("https://randopic.herokuapp.com/likes/4061", config)
    .then(data => data.json())
    .then((data) => {
      spanLikes.innerHTML = data.like_count;
      console.log(JSON.stringify(data));
    })
    .catch(console.error);
}


function createComment(comment) {
  let commentData = {
    content: comment
  };

  let config = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commentData)
  };

  fetch("https://randopic.herokuapp.com/comments/4061", config)
    .then(data => data.json())
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch(console.error);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta');

  fetchData();
  eventListenerLikeBtn();
  eventListenerFormSubmit();

  let imageId = 4061; //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`;

  const likeURL = `https://randopic.herokuapp.com/likes/`;

  const commentsURL = `https://randopic.herokuapp.com/comments/`

});

function eventListenerLikeBtn() {
  const buttonIdLike = document.getElementById("like_button");

  buttonIdLike.addEventListener("click", () => {
    addLike();
  });
}

function eventListenerFormSubmit() {
  const formIdComment = document.getElementById("comment_form");

  formIdComment.addEventListener("submit", (event) => {
    event.preventDefault();
    createComment(event.target.comment.value)
  })
}
