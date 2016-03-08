export default (data, by, id) => {
  let index = false

  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i][by] === id) {
      // we found our id
      index = i
      break    
    }
  }   
  
  return index
}