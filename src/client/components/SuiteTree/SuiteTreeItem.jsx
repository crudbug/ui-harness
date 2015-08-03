import React from "react";
import Radium from "radium";
import * as util from "js-util";
import { css, PropTypes } from "js-util/react";
import Color from "color";
import api from "../../../shared/api-internal";
import { Ul, Twisty, Center } from "../shared";
import IconImage from "../shared/IconImage";

const TEXT_COLOR = Color("white").darken(0.6).hexString();
const SELECTED_BG_COLOR = util.color.fromAlpha(-0.08);


/**
 * An <LI> that renders a single [Suite] list item.
 */
@Radium
export default class SuiteTreeItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen:false, isOver:false, isMounted:false };
  }


  componentDidMount() {
    // Ensure the item is open if a child is selected.
    let isOpen = this.storageIsOpen();
    if (this.isChildSelected()) { isOpen = true; }
    this.toggle(isOpen);

    // Indicate that the component is rendered.
    // NB: Used to prevent <Twisty> from animating on inital load.
    util.delay(() => {
      this.setState({ isMounted:true });
    });
  }



  styles() {
    const { index, total, isRoot, level, width } = this.props;
    const isSelected = this.isSelected();
    const isFirst = (index === 0);
    const isLast = (index === total - 1);
    const hasChildren = this.hasChildren();

    // Calculate width and indent.
    let indent = 0;
    if (level > 0) { indent = 15 * level; }
    const CONTENT_WIDTH = (width ? (width - (indent + 27)) : ""); // Set so that ellipsis show.
    const TITLE_WIDTH = this.isSelected() ? CONTENT_WIDTH - 18 : CONTENT_WIDTH - 5;

    return css({
      base: {
        borderTop: ((isRoot && isFirst) ? "none" : "solid 1px rgba(0, 0, 0, 0.04)"),
        boxSizing: "border-box",
      },
      content: {
        position: "relative",
        width: CONTENT_WIDTH,
        fontSize: 14,
        lineHeight: '36px',
        color: TEXT_COLOR,
        paddingLeft: (27 + indent),
        marginRight: 120,
        ":hover": {
          background: util.color.fromAlpha(-0.02),
          cursor: "pointer"
        }
      },
      contentSelected: {
        background: SELECTED_BG_COLOR,
        ":hover": {
          // NB: Selected item does not present "hover" style.
          background: SELECTED_BG_COLOR,
        }
      },
      title: {
        position: "relative",
        display: "inline-block",
        paddingLeft: 3,
        width: TITLE_WIDTH,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      iconOuter: {
        boxSizing: "border-box",
        position: "absolute",
        left: 7 + indent,
        top: 8,
        paddingLeft: (hasChildren ? 7 : 4),
        paddingTop: (hasChildren ? 5 : 2),
        width: 20,
        height: 20,
      }
    });
  }


  hasChildren() { return this.props.suite.childSuites.length > 0 }


  isSelected() {
      const { suite, selectedSuite } = this.props;
      return selectedSuite
                ? (suite.id === selectedSuite.id)
                : false;
  }


  isCurrent() {
      const currentSuite = api.current.get("suite");
      return (currentSuite && currentSuite.id === this.props.suite.id);
  }


  isChildSelected() {
      const { suite, selectedSuite } = this.props;
      if (!selectedSuite) { return false; }
      if (selectedSuite.id.length <= suite.id.length) { return false; }
      return _.startsWith(selectedSuite.id, suite.id);
  }


  toggle(isOpen) {
      if (this.hasChildren()) {
        if (_.isUndefined(isOpen)) { isOpen = !this.state.isOpen; }
        this.setState({ isOpen: isOpen });
        this.storageIsOpen(isOpen);
      }
  }


  storageIsOpen(isOpen) {
      return api.localStorage(`suite-is-open::${ this.props.suite.id }`, isOpen, { default:false });
  }


  handleClick(e) {
      if (this.hasChildren()) {
        this.toggle();
      } else {
        const { suite } = this.props;
        if (this.isCurrent()) {
          api.indexMode("suite"); // Slide to the "Suite" view.
        } else {
          api.loadSuite(suite); // Load the suite.
        }
      }
  }

  handleMouseEnter() {
      // Alert parent that the mouse is over the [Suite].
      let { suite, onOverSuite } = this.props;
      onOverSuite({
        suite: (this.hasChildren() ? null : suite),
        toggle: (isOpen) => { this.toggle(isOpen); }
      });
      this.setState({ isOver: true });
  }

  handleMouseLeave() {
      this.setState({ isOver: false });
  }


  render() {
    const styles = this.styles();
    const { suite, index, total, level, selectedSuite, onOverSuite, width } = this.props;
    const { isOpen, isMounted, isOver } = this.state;
    const totalChildSuites = suite.childSuites.length;
    const hasChildren = totalChildSuites > 0;
    const isSelected = this.isSelected()

    // Preare selected chrevron pointer.
    let chrevronIcon;
    if (isSelected) {
      const iconName = isOver ? "chevronRightBlue" : "chevronRight";
      const opacity = isOver ? 1 : 0.3;
      chrevronIcon = <IconImage
                        name={ iconName }
                        absolute="11 5 null null"
                        opacity={ opacity }/>;
    }

    // Prepare a list of child-suites if they exist.
    let childItems;
    if (isOpen && hasChildren) {
      childItems = suite.childSuites.map((suite, i) => {
            return <SuiteTreeItem key={i}
                      suite={ suite }
                      index={i}
                      total={ totalChildSuites }
                      level={ level + 1 }
                      selectedSuite={ selectedSuite }
                      onOverSuite={ onOverSuite }
                      width={ width }/>
          });
    }

    return (
      <li style={[ styles.base ]}>
        {/* Item content */}
        <div style={[ styles.content, isSelected && styles.contentSelected ]}
             onMouseDown={ this.handleClick.bind(this) }
             onMouseEnter={ this.handleMouseEnter.bind(this) }
             onMouseLeave={ this.handleMouseLeave.bind(this) }>

          <div style={ styles.iconOuter }>
              {
                hasChildren
                  ? <Twisty isOpen={ isOpen } isAnimated={ isMounted }/>
                  : <IconImage name="suiteBook"/>
              }
          </div>
          <div style={ styles.title }>{ suite.name }</div>
          { chrevronIcon }

        </div>

        {/* Child suites (RECURSION) */}
        { childItems }
      </li>
    );
  }
}

// API -------------------------------------------------------------------------
SuiteTreeItem.propTypes = {
  suite: React.PropTypes.object.isRequired,
  index: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired,
  isRoot: React.PropTypes.bool,
  level: React.PropTypes.number,
  selectedSuite: React.PropTypes.object,
  onOverSuite: React.PropTypes.func.isRequired,
  width: React.PropTypes.number.isRequired
};
SuiteTreeItem.defaultProps = {
  isRoot: false,
  level: 0
};
