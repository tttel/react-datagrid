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
        grade    : Math.round(Math.random() * 10),
        email    : faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName : faker.name.lastName(),
        birthDate: faker.date.past(),
        country  : faker.address.country(),
        city  : faker.address.city()
      })
    }

    cache[len] = arr

    return arr
  }
})();

const gen2 = (() => {

  var cache = {}

  return function(len){

    if (cache[len]){
      return cache[len]
    }

    var arr = []

    for (var i = 0; i < len; i++){
      arr.push({
        id       : i,
        name: faker.name.firstName(),
        age: faker.random.number(),
        gender: ['Female', 'Male'][Math.ceil(Math.random() * 2) - 1],
        location: `${faker.address.country()}, ${faker.address.city()}`,
        status: ['Sent', 'Unsent'][Math.ceil(Math.random() * 2) - 1],
      })
    }

    cache[len] = arr

    return arr
  }
})();

export default gen

export {
  gen2
}