import React, { PropTypes } from 'react'
import Component from 'react-class'
import join from '../../utils/join'
import assign from 'object-assign'
import { Flex } from 'react-flex'




class Scroller extends Component {

  render(){
    const props = this.props
  
    const {
      itemHeight, 
      dataLength, 
      contentHeight
    } = props
    
    const contentClassName = join('react-datagrid__scroller__content')
    const contentProps = {
      className: contentClassName,
      style: {
        height: contentHeight
      }
    }

    return <div
      className="react-datagrid__scroller"
      ref="viewport"
      onScroll={(e) => this.props.onScroll(e.target.scrollTop, e)}
    >
      <Flex wrap={false} row alignItems="stretch" {...contentProps}>
        {props.children}
      </Flex> 
    </div>
  }

  scrollTo(offset){
    this.refs.viewport.scrollTop = offset
  }
}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollTop: PropTypes.number
}

export default Scroller