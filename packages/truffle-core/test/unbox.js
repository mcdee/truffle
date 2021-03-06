const assert = require("assert");
const unbox = require("../lib/commands/unbox");
const Config = require("truffle-config");
const sinon = require("sinon");
const temp = require("temp").track();
let tempDir, mockConfig;

describe("commands/unbox.js", () => {
  const invalidBoxFormats = [
    "//",
    "/truffle-box/bare-box",
    "//truffle-box/bare-box#web3-one",
    "//truffle-box/bare-box#web3-one:path/SubDir",
    "/bare/",
    "//bare#web3-one",
    "//bare#web3-one:path/SubDir"
  ];
  const absolutePaths = [
    "https://github.com/truffle-box/bare-box:/path/SubDir",
    "https://github.com/truffle-box/bare-box#web3-one:/path/subDir",
    "truffle-box/bare-box:/path/subDir",
    "truffle-box/bare-box#web3-one:/path/subDir",
    "bare:/path/subDir",
    "bare#web3-one:/path/subDir",
    "git@github.com:truffle-box/bare-box:/path/subDir",
    "git@github.com:truffle-box/bare-box#web3-one:/path/subDir"
  ];
  const validBoxInput = [
    "https://github.com/truffle-box/bare-box",
    "https://github.com/truffle-box/bare-box#web3-one",
    "truffle-box/bare-box",
    "truffle-box/bare-box#web3-one",
    "bare",
    "bare#web3-one",
    "git@github.com:truffle-box/bare-box",
    "git@github.com:truffle-box/bare-box#web3-one"
  ];
  const relativePaths = [
    "https://github.com/truffle-box/bare-box:path/SubDir",
    "https://github.com/truffle-box/bare-box#web3-one:path/subDir",
    "truffle-box/bare-box:path/subDir",
    "truffle-box/bare-box#web3-one:path/subDir",
    "bare:path/subDir",
    "bare#web3-one:path/subDir",
    "git@github.com:truffle-box/bare-box:path/subDir",
    "git@github.com:truffle-box/bare-box#web3-one:path/subDir"
  ];

  describe("run", () => {
    beforeEach(() => {
      tempDir = temp.mkdirSync();
      mockConfig = {
        logger: { log: () => {} },
        working_directory: tempDir
      };
      sinon.stub(Config, "default").returns({ with: () => mockConfig });
    });
    afterEach(() => {
      Config.default.restore();
    });

    describe("Error handling", () => {
      it("throws when passed an invalid box format", () => {
        invalidBoxFormats.forEach(val => {
          assert.throws(
            () => {
              unbox.run({ _: [`${val}`] });
            },
            Error,
            "Error not thrown!"
          );
        });
      });

      it("throws when passed an absolute unbox path", () => {
        absolutePaths.forEach(path => {
          assert.throws(
            () => {
              unbox.run({ _: [`${path}`] });
            },
            Error,
            "Error not thrown!"
          );
        });
      });
    });

    describe("successful unboxes", () => {
      it("runs when passed valid box input", done => {
        let promises = [];
        validBoxInput.forEach(val => {
          promises.push(
            new Promise(resolve => {
              unbox.run({ _: [`${val}`], force: true }, () => resolve());
            })
          );
        });
        Promise.all(promises).then(() => done());
      });

      it("runs when passed a relative unbox path", done => {
        let promises = [];
        relativePaths.forEach(path => {
          promises.push(
            new Promise(resolve => {
              unbox.run({ _: [`${path}`], force: true }, () => resolve());
            })
          );
        });
        Promise.all(promises).then(() => done());
      });
    });
  });
});
