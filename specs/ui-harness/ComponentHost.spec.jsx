import React from "react";
import Radium from "radium";
import { lorem } from "js-util/test";
import { css, PropTypes } from "js-util/react";
import Foo from "ui-core/components/Foo";
import api from "../../src/shared/api-internal";



@Radium
export default class MyFoo extends React.Component {
  styles() {
    return css({
      base: {
        padding: 20,
        position: "relative",
      }
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>
        <div>foo:{ this.props.foo }</div>
        { this.props.children }
      </div>
    );
  }
}




describe("Component Host", function() {
  this.header(`## Properties of the host container.`).hr(true);

  before(() => {
    this.load( <MyFoo foo='load'><span>Hello</span></MyFoo> )
  });


  section("load", () => {
    it("from `<element>`", () => {
      this.load( <MyFoo foo={ 123 }><span>Hello</span></MyFoo> )
    });

    it("from `Type`", () => {
      this.load(MyFoo, { text:"hello" }, <span>Child</span> );
    });

    it("from `<div>`", () => {
      this.load( <div>My Div</div> );
    });
  });


  section("Nothing in the Section", () => {});


  section("this.props", () => {
    it("props(`now`)", () => {
      this.props({ foo: new Date().toString() })
    });
  });


  section("children", () => {
    it("children", () => {
      this.children( <span>New Children { new Date().toString() }</span> )
    });
  });


  section("size", () => {
    it("read", () => {
      console.log("width():", this.width());
      console.log("height():", this.height());
      console.log("");
    });
    it("`null:null`", () => { this.width(null).height(null) });
    it("`350:200`", () => { this.width(350).height(200) });
    it("`100%:100%`", () => { this.width("100%").height("100%") });
    it("`80%:80%`", () => { this.width("80%").height("80%") });
    it("`100%:null`", () => { this.width("100%").height(null) });
    it("`null:100%`", () => { this.width(null).height("100%") });
  });


  section("align", () => {
    it("`left top`", () => { this.align("left top") });
    it("`left middle`", () => { this.align("left middle") });
    it("`left bottom`", () => { this.align("left bottom") });

    it("`center top`", () => { this.align("center top") });
    it("`center middle`", () => { this.align("center middle") });
    it("`center bottom`", () => { this.align("center bottom") });

    it("`right top`", () => { this.align("right top") });
    it("`right middle`", () => { this.align("right middle") });
    it("`right bottom`", () => { this.align("right bottom") });
  });


  section("align: single value (defaults)", () => {
    it("`left`", () => { this.align("left") });
    it("`middle`", () => { this.align("middle") });
  });


  section("margin", () => {
    it("`0`", () => { this.margin(0); });
    it("`40`", () => { this.margin(40); });
    it("`120`", () => { this.margin(120); });
  });


  section("cropMarks", () => {
    it("read", () => {
      console.log("cropMarks():", this.cropMarks());
      console.log("cropMarks.size():", this.cropMarks.size());
      console.log("cropMarks.offset():", this.cropMarks.offset());
      console.log("api.current.toJS()", api.current.toJS());
      console.log("");
    });
    it("`false`", () => { this.cropMarks(false); });
    it("`true`", () => { this.cropMarks(true); });
    it("`cropMarks.size: 10`", () => { this.cropMarks.size(10) });
    it("`cropMarks.size: 20`", () => { this.cropMarks.size(20) });
    it("`cropMarks.size: 30`", () => { this.cropMarks.size(30) });
    it("`cropMarks.offset: 0`", () => { this.cropMarks.offset(0) });
    it("`cropMarks.offset: 5`", () => { this.cropMarks.offset(5) });
    it("`cropMarks.offset: 10`", () => { this.cropMarks.offset(10) });
  });
});
