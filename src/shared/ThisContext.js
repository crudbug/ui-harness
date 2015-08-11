import _ from "lodash";
import React from "react";
import api from "./api-internal";
import * as util from "js-util";
import { css, PropTypes } from "js-util/react";
import AlignmentContainer from "ui-core/components/AlignmentContainer";


const isBrowser = (typeof window !== 'undefined');
const PROP = Symbol("Prop");
const PROPS = [
  "props",
  "children",
  "width",
  "height",
  "cropMarks",
  "cropMarks.size",
  "cropMarks.offset",
  "margin",
  "align",
  "header",
  "hr",
  "backdrop",
  "backdropColor",
];


/**
 * The [this] context that is passed into the [describe/it]
 * BDD methods.
 */
export default class UIHContext {
  constructor() {
    // Determine whether this is the currently loaded suite.
    const isCurrent = () => {
          const currentSuite = api.current.get("suite");
          return (currentSuite && currentSuite.id === this.suite.id);
        };

    // Read|Write helper for data-property methods.
    this[PROP] = (key, value, options = {}) => {
          // WRITE.
          if (value !== undefined) {
            // Perform type validation.
            const type = options.type;
            if (type) {
              const validation = PropTypes.validate(type, value);
              if (!validation.isValid) {
                throw new Error(`Invalid '${ key }' value (${ value }). Should be ${ type.toString() }.`)
              }
            }

            // Reset the value if required.
            if (options.resetOn !== undefined && value === options.resetOn) {
              value = options.default;
            }

            // Store the value.
            this[PROP].state[key] = value;
            if (isCurrent()) { api.setCurrent({ [key]: value }); }
            return this; // When writing the [this] context is returned.
                         // This allows for chaining of write operations.
          }
          // READ.
          let result = this[PROP].state[key];
          if (_.isUndefined(result)) { result = options.default; }
          return result
        };
    this[PROP].state = {};

    // Property extensions.
    this.cropMarks = (value) =>{ return this[PROP]("cropMarks", value, { default: true, type: PropTypes.bool }); }
    this.cropMarks.size = (value) => { return this[PROP]("cropMarks.size", value, { default: 25, type: PropTypes.number }); };
    this.cropMarks.offset = (value) => { return this[PROP]("cropMarks.offset", value, { default: 5, type: PropTypes.number }); };
  }


  /**
   * Converts to an object of all current values.
   */
  toValues() {
    const result = {};
    PROPS.forEach(key => {
          let propFunc = util.ns(this, key);
          if (_.isFunction(propFunc)) {
            result[key] = propFunc.call(this);
          } else {
            result[key] = this[PROP].state[key];
          }
        });
    return result;
  }


  /**
   * Gets or sets the current properties.
   */
  props(value) { return this[PROP]("componentProps", value); }
  children(value) { return this[PROP]("componentChildren", value); }
  width(value) { return this[PROP]("width", value, { default: "auto", resetOn: null, type: PropTypes.numberOrString }); }
  height(value) { return this[PROP]("height", value, { default: "auto", resetOn: null, type: PropTypes.numberOrString }); }
  margin(value) { return this[PROP]("margin", value, { default: 60, type: PropTypes.number }); }
  align(value) { return this[PROP]("align", value, { default: "center top", type: AlignmentContainer.propTypes.align }); }
  header(value) { return this[PROP]("header", value, { type: PropTypes.string }); }
  hr(value) { return this[PROP]("hr", value, { default: true, type: PropTypes.bool }); }
  backdrop(value) { return this[PROP]("backdrop", value, { default: 0, type: PropTypes.numberOrString }); }




  /**
   * Loads the given component.
   *
   * @param component:  The component Type
   *                    or created component element (eg: <MyComponent/>).
   * @param props:      Optional. The component props (if not passed in with a component element).
   * @param children:   Optional. The component children (if not passed in with a component element).
   */
  load(component, props, children) {
    // Setup initial conditions.
    if (!component) {
      if (isBrowser) { console.warn("Cannot load: a component was not specified (undefined/null)"); }
      return this;
    }
    let type;

    // If a created <element> was passed de-construct
    // it into it's component parts.
    if (component._isReactElement) {
      props = component.props;
      children = props.children;
      delete props.children;
      type = component.type;

    } else {
      type = component;
    }

    // Store on the current state.
    api.setCurrent({
      componentType: type,
      componentProps: props,
      componentChildren: children
    });

    // Finish up.
    api.loadInvokeCount += 1;
    return this;
  }
}
