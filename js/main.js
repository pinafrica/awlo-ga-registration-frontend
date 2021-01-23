const profileImageUpload = () => {
  const uploadButton = document.getElementById('camera-icon')
  const uploadFile = document.getElementById('file-upload')

  uploadButton.addEventListener('click', e => {
    uploadFile.click()
  })

  uploadFile.addEventListener('change', e => {
    readImageFile(e.target.files)
  })
}

var modal = document.querySelector('.modal')
var el = document.querySelector('.croppies')
var vanilla = new Croppie(el, {
  viewport: { width: 300, height: 300, type: 'circle' },
  boundary: { width: 400, height: 400 },
  customClass: 'croppies'
})

const readImageFile = upload => {
  const profilePicture = document.getElementById('profile-image')

  if (upload && upload[0]) {
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      modal.classList.add('is-active')

      vanilla.bind({
        url: e.target.result
      })
    })
    reader.readAsDataURL(upload[0])
    profilePicture.src = e.target.result
  }

  //   vanilla.result({ type: 'canvas', size: 'viewport' }).then()
}
