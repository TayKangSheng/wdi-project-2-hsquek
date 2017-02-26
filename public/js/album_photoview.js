const photoviewer = document.querySelector('div > img')

let thumbnails = document.querySelectorAll('div > .wow > img')

var idx = 0

thumbnails.forEach(function (thumbnail) {
  thumbnail.setAttribute('data-num', idx)
  idx++
  thumbnail.addEventListener('click', function () {
    photoviewer.src = thumbnail.src
    photoviewer.setAttribute('data-num', thumbnail.getAttribute('data-num'))
    console.log(photoviewer.getAttribute('data-num') - 1)
  })
})

let navButtons = document.querySelectorAll('div > button')

navButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var idx = parseInt(photoviewer.getAttribute('data-num'))

    if (button.name === 'next' && idx === 0) {
      photoviewer.src = thumbnails[idx + 1].src
      photoviewer.setAttribute('data-num', idx + 1)
    }

    if (button.name === 'prev' && idx > 0) {
      photoviewer.src = thumbnails[idx - 1].src
      photoviewer.setAttribute('data-num', idx - 1)
    }

    if (button.name === 'next' && idx < thumbnails.length) {
      photoviewer.src = thumbnails[1 + idx].src
      photoviewer.setAttribute('data-num', 1 + idx)
    }
  })
})
