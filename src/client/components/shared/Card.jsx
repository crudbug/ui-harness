import React from "react";
import Radium from "radium";
import Color from "color";
import { NUMBER_OR_STRING } from "../../const";



/**
 * A wrapper that puts content within a card.
 */
@Radium
export default class Card extends React.Component {
  styles() {
    const BACKGROUND_COLOR = Color("white").darken(this.props.darken);
    return {
      base: {
        background: BACKGROUND_COLOR.hexString(),
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderRadius: 1,
        boxShadow: "0 0 8px 0px rgba(0, 0, 0, 0.1)",
        padding: this.props.padding
      }
    };
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>{ this.props.children }</div>
    );
  }
}


Card.propTypes = {
  padding: NUMBER_OR_STRING,
  darken: NUMBER_OR_STRING
};
Card.defaultProps = {
  padding: 0,
  darken: 0
};
