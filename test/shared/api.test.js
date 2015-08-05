import _ from "lodash";
import { expect } from "chai";
import api from "../../src/shared/api";
import bdd from "../../src/shared/bdd";
import ThisContext from "../../src/shared/ThisContext";
import Immutable from "immutable";
import * as util from "js-util";


describe("API Internal", () => {
  before(() => {
    bdd.reset();
    bdd.register();
    api.clearLocalStorage();
  });


  it("has an Immutable map as the [current] state", () => {
    expect(api.current).to.be.an.instanceof(Immutable.Map);
  });


  it("resets the API state", () => {
    api.loadSuite(describe("My Suite", () => {}));
    expect(api.current.toJS()).not.to.eql({});
    expect(api.lastSelectedSuite()).to.exist;
    api.reset();
    expect(api.current.toJS()).to.eql({});
    expect(api.lastSelectedSuite()).not.to.exist;
  });


  it("clears local storage", () => {
    const suite = describe("My Suite", () => {});
    api.lastSelectedSuite(suite);

    const KEY = "ui-harness:lastSelectedSuite";
    expect(_.any(util.localStorage.keys(), item => KEY)).to.equal(true);
    api.clearLocalStorage();
    expect(_.any(util.localStorage.keys(), item => KEY)).to.equal(false);
  });


  describe("loadSuite()", () => {
    it("puts the [suite] into the [current] state", () => {
      const suite = describe("My Suite", () => {});
      api.loadSuite(suite);
      expect(api.current.get("suite")).to.equal(suite);
    });

    it("stores the current suite in local-storage", () => {
      const suite1 = describe("Suite-1", () => {});
      const suite2 = describe("Suite-2", () => {});
      api.loadSuite(suite1);
      expect(api.localStorage("lastSelectedSuite")).to.equal(suite1.id);
      api.loadSuite(suite2);
      expect(api.localStorage("lastSelectedSuite")).to.equal(suite2.id);
    });

    it("puts the [indexMode] into the [current] state", () => {
      const suite = describe("My Suite", () => {});
      api.indexMode("tree");
      api.current = api.current.clear();
      expect(api.current.get("indexMode")).to.equal(undefined);
      api.loadSuite(suite);
      expect(api.current.get("indexMode")).to.equal("tree");
    });
  });


  describe("indexMode", () => {
    it("shows the 'tree' by default", () => {
      api.clearLocalStorage();
      expect(api.indexMode()).to.equal("tree");
    });

    it("stores the mode in local-storage", () => {
      api.clearLocalStorage();
      api.indexMode("suite");
      expect(api.indexMode()).to.equal("suite");
      expect(api.localStorage("indexMode")).to.equal("suite");
    });

    it("updates the [current]", () => {
      api.indexMode("suite");
      expect(api.current.get("indexMode")).to.equal("suite");
    });
  });


  describe("invokeSpec()", () => {
    it("invokes the spec when no [before] handler exists", () => {
      let invokeCount = 0;
      let callbackCount = 0;
      let spec, self;
      describe("my suite", function() {
        spec = it("my spec", function() {
          invokeCount += 1;
          self = this;
        });
      });
      api.invokeSpec(spec, () => { callbackCount += 1 });
      expect(invokeCount).to.equal(1);
      expect(self).to.be.an.instanceof(ThisContext);
      expect(callbackCount).to.equal(1);
    });


    it("invokes asynchronously", (done) => {
      let spec;
      describe("my suite", function() {
        spec = it("my spec", function(done) {
          util.delay(10, () => { done() });
        });
      });
      api.invokeSpec(spec, () => { done() });
    });


    it("invokes the [before] handler before the spec", () => {
      let spec;
      let calls = [];
      describe("my suite", () => {
        let beforeCount = 0;
        before(() => { calls.push("before-1") });
        before(() => { calls.push("before-2") });
        spec = it("my spec", () => { calls.push("spec") });
      });
      api.invokeSpec(spec);
      expect(calls).to.eql([ "before-1", "before-2", "spec" ]);
    });
  });
});
