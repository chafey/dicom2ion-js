# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to Ion

Project Status: pre-release software, do not use yet

## Why convert DICOM to Ion?
- ION supports two encodings - a human readable format like JSON and a compact binary format.  With other codecs, you either get one or the other
- ION is self describing - no external schema required.  Some codecs are like this (JSON), others require a schema (protobuf)
- ION has a rich type system - can store binary data, high precision data, timestamps, annotations and symbolic expressions.  JSON has precision issues with Number types
  and no good support for binary (must encode in base64).  
- ION is optimized for reading/parsing - enables efficient sparse/shallow reads.  ION is much faster at decoding than JSON and competitive with other codecs (protobuf, etc)
- ION has libraries for most popular languages.  Protobuf and JSON have the largest language support, all others are lacking in several ways
- ION will be supported for a very long time - it used internally at Amazon
- ION has direct support for hashing.

Read more here:
https://amzn.github.io/ion-docs/guides/why.html


## Design Thoughts:

- Support async iterator as input so we can design for a full streaming implementation
- Make the attribute->value as simple and lightweight as possible (basically TAG=VALUE)
- Preserve the VRs in the original DICOM P10, but only the ones we need to (private vrs and multi-vr attributes)
- Use human friendly names for attributes (rather than group/element)
- Group related attributes together (e.g. patient, study, series, instance groups)
- Organize groups in the order of most frequently used (uids first, patient details next, etc)

### Input Parameters
- Stream to source DICOM P10
- Stream Info (optional)
  - uri to source DICOM P10 file
  - creation date
  - modification date
- Encoding Algorithm Parameters (optional)
  - privateAttributeMaxInlineLength - defaults to 256
  - standardAttributeMaxInlineLength - defaults to 256

### Returns async interable stream with ion data

### Output Schema
- Attribute Grouping
  - Enables faster parsing/lookups as groups can be skipped
  - Private attributes put in their own group
  - Multiple groups allow enable easier reading/comprehension of data (patient name not mixed with photometric interpretation)
- Uses human readable names vs tags for common attribute groups
  - Easier to read/debug
- Stores VRs separately from values
  - Easier to read/debug.  You rarely need the VR anyway
- Does not parse string values into arrays
  - Easier to read/debug
- Encodes multi valued numeric types into binary data
  - these can be very large (e.g. LUTs) and rarely need to be human readable