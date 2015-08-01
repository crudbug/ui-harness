import React from "react";
import Radium from "radium";
import { NUMBER_OR_STRING } from "../../const";

/**
 * An unstyled <ul>.
 */
@Radium
export default class Ul extends React.Component {
  styles() {
    return {
      base: {
        margin: 0,
        padding: this.props.padding,
        listStyleType: "none"
      }
    };
  }

  render() {
    const styles = this.styles();
    return (
      <ul style={ styles.base }>{ this.props.children }</ul>
    );
  }
}

// API -------------------------------------------------------------------------
Ul.propTypes = {
  padding: NUMBER_OR_STRING
};
Ul.defaultProps = {
  padding: 0
};
