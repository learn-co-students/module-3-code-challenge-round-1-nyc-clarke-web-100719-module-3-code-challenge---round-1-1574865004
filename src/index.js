document.addEventListener('DOMContentLoaded', () => {
  let imgCard   = document.querySelector("#image_card");
  let ul        = document.querySelector("#comments");
  let imgSrc    = document.querySelector("#image");
  let titleImg  = document.querySelector("#name");
  let likes     = document.querySelector("#likes");
  let likeBtn   = document.querySelector("#like_button");
  let form      = document.querySelector("#comment_form");
  // console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4060  // 1 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`


fetch(imageURL)
 .then(function(response) {
   return response.json();})
   .then(function(data) {
     createInfo(data);
   })

   function createInfo(data) {
     console.log(data);
     imgSrc.src = data.url;
     titleImg.textContent = data.name;
     likes.textContent = data.like_count;
     listComments(data.comments);
     
   }

   function listComments(arr) {
    let li = document.createElement("li")
     arr.forEach(function(ele){
      //  console.log(ele.content);
       li.innerHTML = ele.content;
       ul.appendChild(li);
     });
     
     likeBtn.addEventListener("click", function(event) {
      //  console.log(event.target.id);
       if (event.target.id ==="like_button") {
        //  likes.innerHTML = parseInt(likes.textContent) + 1;
         fetch(likeURL,{
           method: "POST",
           headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             image_id: imageId,
            like_count: (likes.innerHTML = parseInt(likes.innerHTML) + 1 )}) 
         });
      }
     })
   }

   form.addEventListener("submit", function(event) {
     event.preventDefault();
    //  console.log(event.target[0].value);
    updateComments(event);
    fetch(commentsURL,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: event.target[0].value
      })
    })
   
   })

  function updateComments(event) {
     let li = document.createElement("li");
     li.textContent = event.target[0].value;
     ul.appendChild(li);
   }







})
