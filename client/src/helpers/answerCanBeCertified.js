export const answerCanBeCertified = (specialties, tags, answer, flagTypes) => {
  if (answer) {
    tags.forEach(tag => {
      specialties.forEach(specialty => {
        if (tag.label.name === specialty.name) {
          flagTypes.push('certified')
        }
      })
    })
  }
}
