const profileImageUpload = () => {
    const uploadButton = document.getElementById('camera-icon')
    const uploadFile = document.getElementById('file-upload')

    uploadButton
      .addEventListener('click', (e) => {
        uploadFile.click()
    })

    uploadFile.addEventListener('change', (e) =>{
        readImageFile(e.target.files)
    })
    
}

const readImageFile = (upload) => {
const profilePicture = document.getElementById('profile-image')

    if (upload && upload[0]){
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
          profilePicture.src = e.target.result
        })
        reader.readAsDataURL(upload[0])
    }
}