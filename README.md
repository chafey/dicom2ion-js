# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to Ion

## Input Parameters
- URI to source DICOM P10 file
- URI to output Ion file
- Encoding Algorithm Parameters (optional)
  - privateAttributeMaxInlineLength - defaults to 256
  - standardAttributeMaxInlineLength - defaults to 256

## Output Schema

This library produces the following output for each SOP Instance parsed:0

- ParsingAlgorithm
  - private attributes inlined (true/false)
  - max length of inline data
- FileInfo
  - full path
  - creation date
  - modification date
  - length of file
  - SHA 256 hash of entire file
- Tree of parsed attributes
  - group
  - element
  - vr (if present)
  - length
  - lengthWasUndefined (true/false)
  - data (union)
    - inline binary data
    - offset of binary data in original dicom p10 file
    - sequence items (for sequence types)
