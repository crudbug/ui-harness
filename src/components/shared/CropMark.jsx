import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";


/**
 * A single crop-mark within the <CropMarks>.
 */
class CropMark extends React.Component {
  styles() {
    const SIZE = this.props.size;
    const OFFSET = this.props.offset;
    const BORDER_COLOR = this.props.color;
    let base, xAxis, yAxis;

    switch (this.props.edge) {
      case "topLeft":
        base = { Absolute: `-${ SIZE - 1 } auto auto -${ SIZE - 1 }` };
        xAxis = { Absolute: `null ${ OFFSET } 0 0` };
        yAxis = { Absolute: `0 0 ${ OFFSET } auto` };
        break;

      case "topRight":
        base = { Absolute: `-${ SIZE - 1 } -${ SIZE - 1 } auto auto` };
        xAxis = { Absolute: `auto 0 0 ${ OFFSET }` };
        yAxis = { Absolute: `0 auto ${ OFFSET } 0` };
        break;

      case "bottomLeft":
        base = { Absolute: `auto auto -${ SIZE - 1 } -${ SIZE - 1 }` };
        xAxis = { Absolute: `0 ${ OFFSET } auto 0` };
        yAxis = { Absolute: `${ OFFSET } 0 0 auto` };
        break;

      case "bottomRight":
        base = { Absolute: `null -${ SIZE - 1 } -${ SIZE - 1 } auto` };
        xAxis = { Absolute: `0 0 auto ${ OFFSET }` };
        yAxis = { Absolute: `${ OFFSET } auto 0 0` };
        break;
    }

    base.width = SIZE;
    base.height = SIZE;
    xAxis.borderBottom = `solid 1px ${ BORDER_COLOR }`;
    yAxis.borderRight = `solid 1px ${ BORDER_COLOR }`;
    return css({ base, xAxis, yAxis });
  }

  render() {
    const styles = this.styles();

    let el = null;
    if (this.props.size > 0) {
      el = <div style={ styles.base }>
             <div style={ styles.xAxis }></div>
             <div style={ styles.yAxis }></div>
           </div>
    }
    return el;
  }
}

// API -------------------------------------------------------------------------
CropMark.propTypes = {
  edge: PropTypes.oneOf(["topLeft", "topRight", "bottomLeft", "bottomRight"]),
  length: PropTypes.number,
  offset: PropTypes.number,
  color: React.PropTypes.string,
};
CropMark.defaultProps = {
  size: 20,
  offset: 5,
  color: "rgba(0, 0, 0, 0.08)"
};


export default Radium(CropMark);
