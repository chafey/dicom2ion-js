# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to Ion

Project Status: pre-release software, do not use yet

## Why convert DICOM to Ion?
- ION supports two encodings - a human readable format like JSON and a compact binary format
- ION is self describing - no external schema required (JSON is too)
- ION has a rich type system - can store binary data, high precision data, timestamps, annotations and symbolic expressions
- ION is optimized for reading/parsing - enables efficient sparse/shallow reads
- ION has libraries for most popular languages 
- ION will be supported for a very long time - it used internally at Amazon
- ION has direct support for hashing

Read more here:
https://amzn.github.io/ion-docs/guides/why.html

## Design Thoughts:

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