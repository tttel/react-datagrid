import React, { PropTypes } from 'react'

const resizeNotifierStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'auto',
    display: 'block',
    pointerEvents: 'none',
    opacity: 0
  }

class ResizeNotifier extends React.Component {
  constructor(props){
    super(props)
 
    this.state = {
      resizeToolWidth: 0,
      resizeToolHeight: 0,
      resizeNotifierWidth: 0,
      resizeNotifierHeight: 0
    }

    this.checkResize = this.checkResize.bind(this)
  }

  render() {
    const props = this.props
    const Component = this.props.factory


    const resizeTool = <div 
      ref="resizeNotifier"
      className="resizeNotifier"
      style={resizeNotifierStyle}
      onScroll={this.checkResize}
    >
        <div 
          ref="resizeTool"
          className="resizeTool" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: this.state.resizeToolWidth,
            height: this.state.resizeToolHeight
          }}
        />
      </div>
    

    return <Component 
      {...props} 
      factory={null} 
      resizeTool={resizeTool} 
      ref="component"
    />
  }

  componentDidMount(){
    this.resetResizeTool()
  }

  getDimensions(){
    const resizeTool = this.refs.resizeTool
    const resizeNotifier = this.refs.resizeNotifier

    return {
      resizeToolWidth: resizeTool.offsetWidth,
      resizeToolHeight: resizeTool.offsetHeight,
      resizeNotifierWidth: resizeNotifier.offsetWidth,
      resizeNotifierHeight: resizeNotifier.offsetHeight
    }    
  }

  resetResizeTool(){
    // check if they are monted
    if(!this.refs.resizeTool && !this.refs.resizeNotifier) {
      console.error(
          'For resizeNotifier to work you must render the resizeTool from {props.resizeTool}'
        )
      return false
    }

    this.setDimensions()
    this.scrollToBottom()
  }

  setDimensions(){
    const {
      resizeNotifierWidth,
      resizeNotifierHeight
    } = this.getDimensions()
  

    // Resize tool will be bigger than it's parent by 1 pixel in each direction
    this.setState({
      resizeNotifierWidth,
      resizeNotifierHeight,
      resizeToolWidth: resizeNotifierWidth + 2,
      resizeToolHeight: resizeNotifierHeight + 2
    })

  }

  scrollToBottom(){
    // so the scroll moves when element resizes
    setTimeout(() => {
      this.refs.resizeNotifier.scrollTop = this.refs.resizeNotifier.scrollHeight
      this.refs.resizeNotifier.scrollLeft = this.refs.resizeNotifier.scrollWidth
    }, 0)
  }


  checkResize(){
    const {
      resizeNotifierWidth,
      resizeNotifierHeight
    } = this.getDimensions()

    if(
      resizeNotifierWidth !== this.state.resizeNotifierWidth ||
      resizeNotifierHeight !== this.state.resizeNotifierHeight
      ){
      // reset resizeToolDimensions
      this.onResize()
      this.resetResizeTool()
    }
  }

  onResize(){
    if (this.props.onResize) {
      this.props.onResize()
    }

    if (this.refs.component.onResize) {
      this.refs.component.onResize()
    }
  }


}

ResizeNotifier.propTypes = {
  onResize: PropTypes.func
}

const resizeNotifier = Component => class extends React.Component {
  render() {
    return <ResizeNotifier factory={Component} {...this.props} />
  }
}

export default resizeNotifier

export {
  ResizeNotifier
}