import { lorem } from "js-util/test";

const LONG_HEADER = `
  # Title
  ## H2 My Subtitle of the thing about the thing.
  ---
  Lorem \`ipsum dolor\` sit amet, consectetur adipisicing elit, sed do.

  - One
  - Two
  - Three

  ${ lorem(30) }

  ## Another H2 Section
  ${ lorem(15) }

  ### H3 Section
  ${ lorem(40) }

      <Markdown
            display="block"
            trimIndent={true}>
        { this.props.markdown }
      </Markdown>


  #### H4 Section
  ${ lorem(40) }

  ---
`;



describe("Header", function() {
  this.header(`
  # Title
  ## Subtitle of the thing as a thing.
  ---
  `);
  this.header(LONG_HEADER);

  it("`null`", () => { this.header(null) });

  section("headers", () => {
    it("title only <h1>", () => { this.header("# My Header"); });
    it("subtitle only <h2>", () => { this.header(`## ${ lorem(10) } \n---`); });
    it("title `.hr(true)`", () => { this.header(`# My Title`).hr(true) });
    it("subtitle `.hr(true)`", () => { this.header(`## ${ lorem(10) }`).hr(true) });
    it("subtitle ---`.hr(true)`", () => { this.header(`## ${ lorem(10) }\n---`).hr(true) });
    it("subtitle ---`.hr(false)`", () => { this.header(`## ${ lorem(10) }\n---`).hr(false) });

    it("title / subtitle (short)", () => {
      this.header(`
      # Title
      ## Subtitle of the thing as a thing.
      ---
      `);
    });

    it("title / subtitle (long)", () => {
      this.header(`
        # Title
        ## Subtitle \`lorem ipsum dolor\` sit amet, ${ lorem(60) }
        ---
      `);
    });

    it("long", () => { this.header(LONG_HEADER); });
    it("long `.hr(true)`", () => { this.header(LONG_HEADER).hr(true); });
    it("long `.hr(false)`", () => { this.header(LONG_HEADER).hr(false); });

  });

  section("backdrop", () => {
    it("`backdrop:0`", () => { this.backdrop(0) });
    it("`backdrop:0.6`", () => { this.backdrop(0.6) });
    it("`backdrop:1`", () => { this.backdrop(1) });
    it("`backdrop:red`", () => { this.backdrop("red") });
  });

});
