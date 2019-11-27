document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
  //SOME HELPFUL VARIABLES!! YAY! 
  let imageId = 4058 //Enter the id from the fetched image here
  // let image = [];
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  // const imageCard = document.getElementById("image_card");
  let imageTitle = document.getElementById("name");
  let imageLikes = document.getElementById("likes");
  // let commentForm = document.getElementById("comment_form");
  const likeButton = document.getElementById("like_button");
  
  const imageTag = document.getElementById("image");

  // STEP ONE: GET THAT PRETTY IMAGGGEEEEEE
  // INITIALIZING FETCH IMAGE!!!
  getImage()
  
  function getImage() {
    fetch(imageURL)
      .then(response=> response.json())
      .then(function(data) {
        imageTag.src = data.url;
        imageTitle.innerHTML = data.name;
        imageLikes.innerHTML = 0
        // cant set at zero because this will automatically reset everytime its rendered.
        // make code more dynamic in step three
      })
  }

  // STEP TWO: INCREACE LIKES (without persistence)
  // listen for click on like button then increase photo likes by one
    likeButton.addEventListener('click', function(event) {
      event.preventDefault();
      // console.log(event.target);
      imageLikes.innerText = parseInt(imageLikes.innerText) + 1
    })

  // STEP THREE: BACKEND PERSIST LIKES
  // CALL THIS FUNCTION IN EVENT LISTENER FUNCTION TO PERSIST LIKES

  // function increaseLikes() {
  fetch(likeURL, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_id: imageId,
          image_likes: `${imageLikes.innerText}`
      })

    }).then(response=>response.json())
    // optimistic rendering shouldn't have to do anything with the response...
    // .then(data=> console.log(data)); // come back here

// }
// EXAMPLE RESPONSE --- 
// getting expected response -- now get likes from the id
  // {
  //   "id": 112,
  //     "image_id": 8,
  //       "created_at": "2017-11-17T13:52:22.167Z",
  //         "updated_at": "2017-11-17T13:52:22.167Z"
  // }
  

 



})




