import React from "react";
import Radium from "radium";
import Immutable from "immutable";

import { css, PropTypes } from "js-util/react";
import api from "../../shared/api-internal";
import SuiteTree from "./SuiteTree";
import Suite from "./Suite";



/**
 * The index column.
 */
@Radium
export default class IndexColumn extends React.Component {
  componentWillMount() {
    document.addEventListener ("keydown", this.handleKeyDown.bind(this));
  }


  handleKeyDown(e) {
    if (this.isOver) {
      // Alert child components of the key-event.
      switch (this.indexMode()) {
        case "tree":
          this.refs.suiteTree.handleKeyDown(e);
          break;

        case "suite":
          this.refs.suite.handleKeyDown(e);
          break;
      }
    }
  }


  indexMode() { return api.indexMode() || "tree"; }


  styles() {
    const { current, width } = this.props;
    const indexMode = this.indexMode();

    // Calculate slide position of panels.
    if (indexMode && width) {
      var suiteTreeLeft = indexMode === "tree" ? 0 : (0 - width);
      var suiteLeft = indexMode === "suite" ? 0 : width;
    }

    return css({
      base: {
        Absolute: 0,
        overflowY: "auto",
        overflowX: "hidden",
        paddingTop: 3
      },
      outer: {
        transition: "left 0.15s"
      },
      suiteTree: {
        position: "absolute", top: 0, bottom: 0,
        width: "100%",
        left: suiteTreeLeft
      },
      specs: {
        position: "absolute", top: 0, bottom: 0,
        width: "100%",
        left: suiteLeft,
      }
    });
  }


  handleMouseEnter() { this.isOver = true; }
  handleMouseLeave() { this.isOver = false; }


  render() {
    const styles = this.styles();
    const { current, width } = this.props;
    const currentSuite = current.get("suite");

    return (
      <div style={ styles.base }
           onMouseEnter={ this.handleMouseEnter.bind(this) }
           onMouseLeave={ this.handleMouseLeave.bind(this) }>

        <div style={[ styles.outer, styles.suiteTree ]}>
          <SuiteTree ref="suiteTree" selectedSuite={ currentSuite } width={ width } />
        </div>
        <div style={[ styles.outer, styles.specs ]}>
          { currentSuite ? <Suite ref="suite" suite={ currentSuite } /> : null }
        </div>

      </div>
    );
  }
}


// API -------------------------------------------------------------------------
IndexColumn.propTypes = {
  current: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  width: React.PropTypes.number.isRequired
};
IndexColumn.defaultProps = {};
