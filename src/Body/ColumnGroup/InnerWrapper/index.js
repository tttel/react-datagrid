import React, { PropTypes } from 'react'
import Component from 'react-class'
import Row from './Row'
import shallowequal from 'shallowequal'

export default class ColumnGroupInnerWrapper extends Component {
  
  shouldComponentUpdate(nextProps){
    return !shallowequal(nextProps, this.props)
  }

  render(){
     const props = this.props
     const {
       data,
       from,
       to,
       rowHeight,
       globalProps,
       onRowMouseEnter,
       onRowMouseLeave,
       onRowClick,
       renderRow,
       cellFactory,
       rowStyle,
       overRowId,
       // selected can be an object or an index
       selected,
       isMultiselect,
       hasSelection,
       activeIndex,
       onRowFocus,
       rowProps: passedProps,
       zebraRows,
       bufferValid,
       isScrolling,
       isPlaceholderActive,
       renderRowPlaceholder,
       columns,
       minWidth,
       rowRef
     } = props

    const rows = data.slice(from, to).map((rowData, index, dataSlice) => {
       const id = rowData[globalProps.idProperty]
       const over = overRowId === id
       const realIndex = index + from
       const even = !!(realIndex % 2)
       const active = activeIndex === realIndex

       const keyIndex = rowRef === 'realIndex'? realIndex : index
       const key = `row-${keyIndex}`

       const isSelected = hasSelection && 
                         (
                           isMultiselect? 
                             selected.hasOwnProperty(id) : // TODO: use hasOwn, with curry
                             selected == id // to allow type conversion, so 5 == '5'
                         )

        

       const rowProps = {
         id,
         columns,
         minWidth,
         active,
         key,
         over,
         renderRow,
         cellFactory,
         rowStyle,
         realIndex, // is used rowSelect, for a correct selection (onClick)
         rowHeight,
         passedProps,
         bufferValid,
         isScrolling,
         isPlaceholderActive,
         renderRowPlaceholder,
         selected: isSelected, // row uses selected as a bool, a state 
         data: rowData, 
         onMouseEnter: onRowMouseEnter,
         onMouseLeave: onRowMouseLeave,
         onClick: onRowClick,
         onFocus: onRowFocus
       }

       if (zebraRows) {
         rowProps.even = even
         rowProps.odd = !even
       } else {
         rowProps.even = false
         rowProps.odd = false
       }

       let row
       if (props.rowFactory){
         row = props.rowFactory(rowProps)
       }

       if (row === undefined){
         row = <Row {...rowProps} />
       }

       return row
     })

      return <div>{rows}</div>
   }
}

ColumnGroupInnerWrapper.defaultProps = {
  rowRef: 'realIndex'
}

ColumnGroupInnerWrapper.propTypes = {
  rowRef: PropTypes.oneOf(['realIndex', 'renderIndex'])
}