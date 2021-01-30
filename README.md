# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to Ion

Project Status: pre-release software, do not use yet

Design Thoughts:

## Input Parameters
- Stream to source DICOM P10
- Stream Info (optional)
  - uri to source DICOM P10 file
  - creation date
  - modification date
- Encoding Algorithm Parameters (optional)
  - privateAttributeMaxInlineLength - defaults to 256
  - standardAttributeMaxInlineLength - defaults to 256

## Returns async interable stream with ion data

## ION Output Schema

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
  - data - the binary data (if inlined)
  - dataOffset - the offset of the data in the source DICOM P10 file
  - items - array of dataSets (sequence items only)
