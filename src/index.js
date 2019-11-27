document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  /**URL and image ID */
  let imageId = 4055 //Enter the id from the fetched image here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  
  /**Page init */
  generatePage();

  /**Fetches an image */
  function generatePage(){    
    fetch(imageURL)
      .then(resp=>resp.json())
      .then(json=>{
        //console.log(json);
        generateImageInfo(json);
        generateComments(json.comments,false);
      });
  }

  /**Helper method for generatePage
   * Renders the image tag, the title, and likes
   * 
   * Takes an argument of the imageAPI response as json
   */
  function generateImageInfo(jsonData){
    let image = document.getElementById('image-span');
    
    image.innerHTML = `
      <img src="${jsonData.url}" id="image" data-id="${jsonData.id}">
    `;

    image.parentElement.querySelector('#name').innerText = jsonData.name;
    image.parentElement.querySelector('#likes').innerText = jsonData.like_count;
  }


  /**Helper method for generatePage and submitComment
   * Renders a single comment if newFlag is true,
   * otherwise renders all comments.
   * 
   * Takes two arguments:
   *    - comment json
   *    - boolean flag to denote if this is being called for rendering a new comment or loading the initial page 
   */
  function generateComments(jsonData, newFlag){
    let commentUL = document.getElementById('comments');
    if (newFlag) {
      let comment = jsonData;
      let liComment = document.createElement('li');
      liComment.id = `${comment.id}comment`
      liComment.textContent = comment.content;
      liComment.innerHTML += `<br><button id="delete">Delete Comment</button>`
      commentUL.appendChild(liComment); 
    }
    else{
    jsonData.forEach(function(comment){
      let liComment = document.createElement('li');
      liComment.id = `${comment.id}comment`;
      liComment.textContent = comment.content;
      liComment.innerHTML += `<br><button id="delete">Delete Comment</button>`
      commentUL.appendChild(liComment); 
    })
    }
  }

  /**Event Delegation (see in-line comments)*/
  document.addEventListener('click', (e) => {
    e.preventDefault();
    let postconfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    //Post a new comment
    if (e.target.id === "submit"){
      let comment = document.getElementById('comment_input');
      submitComment(comment.value, postconfig);
      comment.value = "";
    }
    //Increment like counter
    else if(e.target.id === "like_button"){
      incLikes(postconfig);
    }
    //Delete specific comment
    else if(e.target.id === "delete"){
      let parent = e.target.parentElement;
      deleteComment(parent, postconfig);
    }
  })

  /**Method for post new comment click event
   * Sends POST request to API to add new comment and updates DOM to reflect new comment
   * 
   * Takes two arguments:
   *    -The comment text
   *    -configuration for the fetch request
   */
  function submitComment(comment, postconfig){
      postconfig.body = JSON.stringify({
        image_id: imageId,
        content: comment
      });
      fetch(commentsURL, postconfig)
        .then(resp=>resp.json())
        .then(json=>{
          generateComments(json,true);
        });
  }

  /**Method for incrementing likes click event
   * Sends POST request to API to increment likes and updates DOM to reflect new like total
   * 
   * Takes an argument of the configuration for the fetch request
   */
  function incLikes(postconfig){
    postconfig.body = JSON.stringify({
      image_id: imageId
    })
    fetch(likeURL, postconfig)
      .then(resp=>resp.json())
      .then(json=>{
        let likes =  document.querySelector('#likes');
        likes.innerText = parseInt(likes.innerText) + 1;
      });
    }

  /**Method for deleting comment click event
   * Sends DELETE request to API to delete a specific comment and removes the comment from the DOM
   * Alerts user on successful deletion, to prevent unintentional deletion of other comments  
   * 
   * Takes two arguments:
   *    -The comment element
   *    -configuration for the fetch request
   */
  function deleteComment(comment, config){
    config.method = 'DELETE';
    let id = parseInt(comment.id);
    let deleteURL = `https://randopic.herokuapp.com/comments/${id}`;

    fetch(deleteURL, config)
      .then(resp=>resp.json())
      .then(json=>{
        comment.remove();
        alert("Comment successfully deleted");
      })
  }

})