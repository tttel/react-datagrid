const notEmpty = x => !!x

export default (...args) => {
  return args.filter(notEmpty).join(' ')
}
