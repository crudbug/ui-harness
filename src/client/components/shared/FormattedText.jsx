import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { formatText } from "../../../shared/util";


/**
 * Formats text/markdown into HTML.
 */
@Radium
export default class FormattedText extends React.Component {
  styles() {
    return css({
      base: {}
    });
  }

  render() {
    const styles = this.styles();
    const html = formatText(this.props.children);
    return (
      <span
          style={ styles.base }
          dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}

// API -------------------------------------------------------------------------
FormattedText.propTypes = {
  children: React.PropTypes.string,
};
FormattedText.defaultProps = {};
