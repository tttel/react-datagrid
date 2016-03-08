const getDataRangeToRender = (bodyHeight, itemHeight, scrollTop, extraRows = 4) => {
  let noItemsToRender = parseInt(bodyHeight / itemHeight + extraRows, 10)

  // ajust from and to so that rows have the same
  // odd and even classNames
  // from must be even
  // and to must be od

  // noItemsToRender must be odd
  if (noItemsToRender % 2 === 0) {
    noItemsToRender += 1
  }

  if (scrollTop <= (extraRows/2) * itemHeight) {
    // reder first n items
    return {
      from: 0,
      to: noItemsToRender
    }
  }

  let renderFrom = parseInt(scrollTop / itemHeight - (extraRows / 2), 10)
  
  // fisrt must be even
  if (renderFrom % 2 !== 0) {
    renderFrom += 1  
  }

  const rangeToRender = {
    from: renderFrom,
    to: renderFrom + noItemsToRender,
  }

  return rangeToRender
}

export default getDataRangeToRender