import { expect } from "chai";
import { JsonMessage } from "../src/messages/jsonmessage";

const content = { value: "Message content" };
const timestamp = 1593061836956;

describe("Message with all data", () => {
  let json: JsonMessage;

  beforeEach(() => {
    json = new JsonMessage("Descriptor", content, "1234", timestamp, "4321");
  });

  it("contains descriptor", () => {
    expect(json.getDescriptor()).to.be.equal("Descriptor");
  });

  it("contains content", () => {
    expect(json.getContent()).to.deep.equal({ value: "Message content" });
  });

  it("contains serialized content", () => {
    expect(json.getSerializedContent()).to.deep.equal(
      '{"value":"Message content"}'
    );
  });

  it("contains uuid", () => {
    expect(json.getUUID()).to.be.equal("1234");
  });

  it("contains creation date", () => {
    expect(json.getCreationDate().toISOString()).to.be.equal(
      "2020-06-25T05:10:36.956Z"
    );
  });

  it("contains parent message", () => {
    expect(json.getParentMessage()).to.be.equal("4321");
  });
});

describe("Message with missing data", () => {
  let json: JsonMessage;

  it("contains uuid event not providing it", () => {
    json = new JsonMessage("Descriptor", content);
    expect(json.getUUID()).to.not.undefined;
  });

  it("contains creation date even not providing a timestamp", () => {
    json = new JsonMessage("Descriptor", content, "1234", null, "4321");
    expect(json.getCreationDate()).to.be.instanceof(Date);
  });

  it("doesn't contains a parent message", () => {
    json = new JsonMessage("Descriptor", content, "1234", timestamp);
    expect(json.getParentMessage()).to.be.undefined;
  });
});
