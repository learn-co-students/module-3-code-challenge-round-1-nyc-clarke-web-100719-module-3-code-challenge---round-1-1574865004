document.addEventListener('DOMContentLoaded', () => {
  // console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
  let imageId = 4054 //Enter the id from the fetched image here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  let imageHTML = document.getElementById("image")
  let name = document.querySelector("#name")
  let likeCount = document.querySelector("#likes")
  let listOfComments = document.querySelector("#comments")
  let likeButton = document.querySelector("#like_button")
  let inputForm = document.querySelector("#comment_form")


  fetch(imageURL).then(function(resp){return resp.json();}).then(function(data){
    imageHTML.setAttribute("src", data.url)
    name.innerHTML = data.name
    likeCount.innerHTML = parseInt(data.like_count)
    data.comments.forEach(function(comment){
      let commentContent = `<li id=${comment.id}>${comment.content}<button>DELETE</button></li>`
      listOfComments.insertAdjacentHTML("beforeend", commentContent)
    })
    // console.log(data)
  })

  likeButton.addEventListener('click', function(event){
    likeCount.innerHTML++
    fetch(likeURL, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        "Accept": "application/json"
      },
      body: JSON.stringify({
        image_id: imageId
      })
    })
  })

  inputForm.addEventListener("submit", function(event){
    let newComment = event.target[0].value
    let newCommentHTML = `<li>${newComment} <button>DELETE</button></li>`
    listOfComments.insertAdjacentHTML("beforeend", newCommentHTML)

    fetch(commentsURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        image_id: imageId,
        content: newComment
      })
    })
  })

    listOfComments.addEventListener('click', function(event){
      if(event.target.tagName === "BUTTON"){
        let commentTarget = event.target.closest("li")
        fetch(commentsURL + `/${commentTarget.id}`, {
          method: "DELETE"
        }).then(function(resp){return resp.json}).then(function(data){
          commentTarget.remove()
        })
      }
    })

    
  //DCL
  

})

// fetch(likeURL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "applicatioon/json",
//     "Accept": "application/json"
//   },
//   body: JSON.stringify({
//     "image_id": imageId,
//     "likes": likeCount
//   }).then(function(resp){return resp.json()}).then(function(data){
//     console.log(data)
//   })
// })