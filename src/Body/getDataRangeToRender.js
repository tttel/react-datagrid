const getDataRangeToRender = (bodyHeight, itemHeight, scrollTop, extraRows = 4) => {
  const noItemsToRender = parseInt(bodyHeight / itemHeight + extraRows, 10)
  
  if (scrollTop <= (extraRows/2) * itemHeight) {
    // reder first n items
    return {
      from: 0,
      to: noItemsToRender
    }
  }

  const renderFrom = parseInt(scrollTop / itemHeight - (extraRows / 2), 10)
  const rangeToRender = {
    from: renderFrom,
    to: renderFrom + noItemsToRender,
  }

  return rangeToRender
}

export default getDataRangeToRender