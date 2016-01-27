import faker from 'faker'

const gen = (() => {

  var cache = {}

  return function(len){

    if (cache[len]){
      return cache[len]
    }

    var arr = []

    for (var i = 0; i < len; i++){
      arr.push({
        id       : i,
        grade      : Math.round(Math.random() * 10),
        email    : faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName : faker.name.lastName(),
        birthDate: faker.date.past()
      })
    }

    cache[len] = arr

    return arr
  }
})();

export default gen
