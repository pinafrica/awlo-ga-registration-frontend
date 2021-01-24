let autocomplete
let input
function initializeGooglePlaces () {
  input = document.querySelector('input#location')
  autocomplete = new google.maps.places.Autocomplete(input)
}

document.addEventListener('DOMContentLoaded', initializeGooglePlaces)
document.addEventListener('DOMContentLoaded', () => {
  // Add intl-tel-input
  window.intlTelInputGlobals.loadUtils('scripts/utils.js')
  var input = document.querySelector('#phoneNumber')
  window.intlTelInput(input, {
    // any initialisation options go here
    initialCountry: 'ng',
    separateDialCode: true,
    hiddenInput: 'full_phone',
    utilsScript: 'scripts/utils.js'
  })
})

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
      imageBlob = e.target.result
      vanilla.bind({
        url: imageBlob
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
      const url = URL.createObjectURL(blob)
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
  const phoneNumber = document.querySelector('input[name="full_phone"]').value
  const location = document.querySelector('input[name="location"]').value
  const bio = document.querySelector('textarea[name="bio"]').value
  const profilePicture = imageBlob
  const reason = document.querySelector('textarea[name="reason"]').value

  let formData = new FormData()
  formData.set('firstName', firstName)
  formData.set('lastName', lastName)
  formData.set('email', email)
  formData.set('phoneNumber', phoneNumber)
  formData.set('location', location)
  formData.set('bio', bio)
  formData.set('profilePicture', profilePicture)
  formData.set('reason', reason)

  saveToServer(formData)
}

const saveToServer = data => {
  const url = 'https://awlo-ga-program.herokuapp.com/api/v1/create'
  fetch(url, {
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Registration Successful') {
        swal(
          'Registration Successful!',
          'Your registration was successful! Check your email for more details.',
          'success'
        )
        setTimeout(
          (window.location = 'http://awlo.org/gender-ambassadors/'),
          5000
        )
      } else if (data.error) {
        swal(
          'Registration Failed',
          'Something went wrong with your registration',
          'error'
        )
        setTimeout(
          (window.location = 'http://awlo.org/gender-ambassadors/'),
          5000
        )
      }
    })
    .catch(err => {
      swal(
        'Submission Error',
        'Try again later, can not submit form at this time',
        'error'
      )
    })
}
