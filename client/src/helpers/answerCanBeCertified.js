const answerCanBeCertified = (specialties, tags, answer, flagTypes) => {
  let isCertified = false

  if (answer) {
    tags.forEach(tag => {
      specialties.forEach(specialty => {
        if (tag.label.name.includes(specialty.name) && !isCertified) {
          flagTypes.push('certified')
          isCertified = true
        }
      })
    })
  }
}

export default answerCanBeCertified
