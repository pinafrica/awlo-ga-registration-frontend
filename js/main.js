window.onload = e => profileImageUpload()
const uploadFile = document.getElementById('file-upload')
const preview = document.querySelector('.croppies')
let imageModal = document.querySelector('.modal')
let vanilla = new Croppie(preview, {
  viewport: { width: 200, height: 200, type: 'circle' },
  boundary: { width: 300, height: 300 },
  customClass: 'croppies'
})

const profileImageUpload = () => {
  const uploadButton = document.getElementById('camera-icon')
  uploadButton.addEventListener('click', e => {
    uploadFile.click()
  })

  uploadFile.addEventListener('change', e => {
    readImageFile(e.target.files)
  })
}


const readImageFile = (upload) => {

  if (upload && upload[0]) {
    const reader = new FileReader()
    reader.addEventListener('load', e => {
        imageModal.classList.add('is-active')

        vanilla.bind({
            url: e.target.result
        })

        bindProfilePicture(vanilla, imageModal) 
    })
    reader.readAsDataURL(upload[0])
  }
}

const bindProfilePicture = (vanilla, imageModal) => {
    const profilePicture = document.getElementById('profile-image')
    const profileOkBtn = document.querySelector('.cropBtn')

    profileOkBtn.addEventListener('click', (e) => {
        e.preventDefault()
        vanilla.result('blob').then((blob) => {
            const url = URL.createObjectURL(blob)
            return profilePicture.src = url
        })
        imageModal.classList.remove('is-active')
    })
}
