document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4062 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`


fetch("https://randopic.herokuapp.com/images/4062")
  .then(resp => resp.json())
  .then(image => {
    console.log(image)
  // image.innerHTML = ${image.name}
  



    
  }) 





})
