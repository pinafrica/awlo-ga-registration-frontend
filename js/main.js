// Set up Google Autocomplete
let autocomplete
let input
function initializeGooglePlaces () {
  input = document.querySelector('input#location')
  autocomplete = new google.maps.places.Autocomplete(input)
}

// Initialize International Telephone Input Format, Copyright Year and Listen for form submission
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Google Autocomplete
  initializeGooglePlaces()

  // Add intl-tel-input
  window.intlTelInputGlobals.loadUtils('js/utils.js')
  const input = document.querySelector('#phone')
  window.intlTelInput(input, {
    // any initialisation options go here
    initialCountry: 'ng',
    separateDialCode: true,
    hiddenInput: 'fullPhone',
    utilsScript: 'js/utils.js'
  })

  // Add Copyright Year
  document.querySelector('.copyright').innerText = new Date().getFullYear()

  // Start listening for form submission event
  const form = document.querySelector('form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    getFormData()
  })
})

// Initialize Image Croppie
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

const clearErrorMessageOnchange = fields => {
  fields.forEach(field => {
    field.addEventListener('change', () => {
      const errorText = document.querySelector('.has-text-danger')

      if (field.parentNode.contains(errorText)) {
        field.classList.remove('is-danger')
        errorText.remove()
      }

    })
  })
}

const validateProfilePic = () => {
  const profilePicture = document.querySelector('input[name="profilePicture"]')

  // remove error text if it exist
  const errorText = profilePicture.parentNode.querySelector('p')
  if (errorText) {
    errorText.remove()
  }

  // create error text
  const warning = document.createElement('p')
  warning.classList.add('has-text-danger', 'is-size-7')
  warning.innerText = 'Select profile picture'

  if (profilePicture.value === '') {
    profilePicture.parentNode.appendChild(warning)
    return false
  }
  return true
}

const checkEmptyFields = fields => {
  let isEmpty
  fields.forEach(field => {
    // remove error text if it exist
    const errorText = field.parentNode.querySelector('p')
    if (errorText) {
      errorText.remove()
    }

    // create error text
    const warning = document.createElement('p')
    warning.classList.add('has-text-danger', 'is-size-7')
    warning.innerText = 'Invalid Input'

    if (field.value !== '') {
      field.classList.remove('is-danger')
      return (isEmpty = true)
    }

    if (field.value === '') {
      field.classList.add('is-danger')
      field.parentNode.appendChild(warning)
      return (isEmpty = false)
    }
  })
  return isEmpty === true ? validateProfilePic() : isEmpty
}

const validateCheckBox = () => {
  const checkBox = document.querySelector('input[type="checkbox"]')

  // remove error text if it exist
  const errorText = checkBox.parentNode.querySelector('p')
  if (errorText) {
    errorText.remove()
  }

  // create error text
  const warning = document.createElement('p')
  warning.classList.add('has-text-danger', 'is-size-7')
  warning.innerText = 'Agree to our terms to proceed'
  const isChecked = checkBox.checked

  if (!isChecked) {
    checkBox.parentNode.appendChild(warning)
  }

  return isChecked
}

const getFormData = () => {
  //validate form HERE
  const inputs = document.querySelectorAll(
    'input[type="text"],input[type="email"],input[type="tel"],textarea'
  )

  //clear error text on input change
  clearErrorMessageOnchange(inputs)

  const submitButton = document.querySelector('.submit-button')

  if (checkEmptyFields(inputs) && validateCheckBox()) {
    //   Change submit form behaviour
    submitButton.classList.add('blue')
    submitButton.innerHTML =
      'Loading &nbsp; <span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>'

    //   construct formdata
    constructFormData()
  }
}

const constructFormData = () => {
  const firstName = document.querySelector("input[name='firstName']").value
  const lastName = document.querySelector("input[name='lastName']").value
  const email = document.querySelector("input[name='email']").value
  const phoneNumber = document.querySelector("input[name='fullPhone']").value
  const location = document.querySelector("input[name='location']").value
  const bio = document.querySelector("textarea[name='bio']").value
  const profilePicture = imageBlob
  const reason = document.querySelector("textarea[name='reason']").value

  let formData = new FormData()
  formData.set('firstName', firstName)
  formData.set('lastName', lastName)
  formData.set('email', email)
  formData.set('phoneNumber', phoneNumber)
  formData.set('location', location)
  formData.set('bio', bio)
  formData.set('profilePicture', profilePicture)
  formData.set('reason', reason)

  // Send the form to the Backend for saving
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
