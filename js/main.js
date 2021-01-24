let autocomplete
let input
function initializeGooglePlaces () {
  input = document.querySelector('input#location')
  autocomplete = new google.maps.places.Autocomplete(input)
}

document.addEventListener('DOMContentLoaded', initializeGooglePlaces)

window.onload = e => profileImageUpload()
const uploadFile = document.getElementById('file-upload')
const preview = document.querySelector('.croppies')
let imageModal = document.querySelector('.modal')
let vanilla = new Croppie(preview, {
  viewport: { width: 200, height: 200, type: 'circle' },
  boundary: { width: 300, height: 300 },
  customClass: 'croppies'
})
let imageBlob
const submitButton = document.querySelector('.submit-button')
submitButton.addEventListener('click', e => {
  e.preventDefault()
  getFormData()
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

const readImageFile = upload => {
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

  profileOkBtn.addEventListener('click', e => {
    e.preventDefault()
    vanilla.result('blob').then(blob => {
      imageBlob = blob
      const url = URL.createObjectURL(imageBlob)
      return (profilePicture.src = url)
    })
    imageModal.classList.remove('is-active')
  })
}

const getFormData = () => {
  //validate form HERE
  constructFormData()
}

const constructFormData = () => {
  const firstName = document.querySelector('input[name="firstName"]').value
  const lastName = document.querySelector('input[name="lastName"]').value
  const email = document.querySelector('input[name="email"]').value
  const phoneNumber = document.querySelector('input[name="phoneNumber"]').value
  const location = document.querySelector('input[name="location"]').value
  const bio = document.querySelector('textarea[name="bio"]').value
  const profilePicture = imageBlob
  const reason = document.querySelector('textarea[name="reason"]').value

  let formData = new FormData()
  formData.append('firstName', firstName)
  formData.append('lastName', lastName)
  formData.append('email', email)
  formData.append('phoneNumber', phoneNumber)
  formData.append('location', location)
  formData.append('bio', bio)
  formData.append('profilePicture', profilePicture)
  formData.append('reason', reason)

  saveToServer(formData)
}

const saveToServer = data => {
  const url = 'http://localhost:3000/api/v1/create'
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}
