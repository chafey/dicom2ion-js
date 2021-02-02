# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to Ion

Project Status: pre-release software, do not use yet

## Why convert DICOM to Ion?
- ION supports two encodings - a human readable format like JSON and a compact binary format.  With other codecs, you either get one or the other
- ION is self describing - no external schema required.  Self describing codecs are not as space efficient as schema based codecs, but are easier to work with as they are self contained
- ION has a rich type system - can store binary data, high precision data, timestamps, annotations and symbolic expressions.  JSON has precision issues with Number types
  and poor support for binary (must encode in base64).  
- ION is optimized for reading/parsing - enables efficient sparse/shallow reads.  ION is much faster at decoding than JSON and competitive with other codecs (protobuf, etc)
- ION has libraries for most popular languages.  Protobuf and JSON have the largest language support, all others are lacking in several ways
- ION will be supported for a very long time - it used internally at Amazon
- ION has direct support for hashing.

Read more here:
https://amzn.github.io/ion-docs/guides/why.html


## Design Thoughts:

- Support async iterator as input so we can design for a full streaming implementation
- Make the attribute->value as simple and lightweight as possible (basically TAG=VALUE)
- Preserve the VRs in the original DICOM P10, but only the ones we don't already know (private vrs and multi-vr attributes)
- Use human friendly (Keyword) names for attributes (rather than group/element)
- Group related attributes together (e.g. patient, study, series, instance groups) to improve read/access/parse times (and human comprehension)
- Organize groups in the order of most frequently used (uids first, patient details next, etc)
- Must be possible to regenerate DICOM P10 from ION Format.  Ideally bit for bit lossless, but semantic equivalence is acceptable
- Store the sha256 digest of the original DICOM P10 so we can very integrity later
- Store the sha256 for each referenced data item so we can verify integrity later

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
- Does not parse multi-valude string values into arrays
  - Easier to read/debug
- Encodes multi valued numeric types into binary data
  - these can be very large (e.g. LUTs) and rarely need to be human readable

### Example Output
```javascript
{
  sourceInfo: {
    uri: "file:///workspaces/dicom2ion-js/test/fixtures/IM00001.implicit_little_endian.dcm"
  },
  options: {
    maximumInlineDataLength: {
      standard: 256,
      private: 256
    }
  },
  fileInfo: {
    sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6",
    createdAt: 2021-02-02T09:27:49.089Z
  },
  dataSet: {
    SOPClassUID: "1.2.840.10008.5.1.4.1.1.3.1",
    SOPInstanceUID: "1.3.6.1.4.1.25403.166563008443.732.20120418082458.3",
    StudyInstanceUID: "1.3.6.1.4.1.25403.166563008443.732.20120418082458.1",
    SeriesInstanceUID: "1.3.6.1.4.1.25403.166563008443.732.20120418082458.2",
    TransferSyntaxUID: "1.2.840.10008.1.2",
    PatientName: "US Echo",
    PatientID: null,
    PatientBirthDate: null,
    PatientSex: null,
    StudyDescription: "US Dopler",
    ProtocolName: null,
    AccessionNumber: null,
    StudyID: null,
    StudyDate: "20120418",
    StudyTime: "152643",
    SeriesDescription: null,
    SeriesNumber: null,
    Modality: "US",
    BodyPartExamined: null,
    SeriesDate: "20120418",
    InstanceNumber: "12",
    AcquisitionDate: "20120418",
    AcquisitionTime: null,
    ContentDate: "20120418",
    ContentTime: "153409",
    SpecificCharacterSet: "ISO-IR 100",
    Rows: 240,
    Columns: 320,
    PhotometricInterpretation: "RGB",
    ImageType: "ORIGINAL\\PRIMARY\\\\0011",
    BitsAllocated: 8,
    BitsStored: 8,
    HighBit: 7,
    PixelRepresentation: 0,
    SamplesPerPixel: 3,
    Manufacturer: "ACUSON",
    SourceApplicationEntityTitle: null,
    ImplementationVersionName: "VIMS_1.0",
    PixelData: {
      dataOffset: 1726,
      length: 1843200,
      sha256: "a9046b37a5d74aaa172b22367619c5e3353de37a611e862c73790cdccd3ba130"
    },
    FileMetaInformationGroupLength: {{wAAAAA==}},
    FileMetaInformationVersion: {{AAE=}},
    MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.3.1",
    MediaStorageSOPInstanceUID: "1.3.6.1.4.1.25403.166563008443.732.20120418082458.3",
    ImplementationClassUID: "1.2.840.113747.20080222",
    ReferringPhysicianName: null,
    StageName: "Im Post 400",
    StageNumber: "3",
    NumberOfStages: "3",
    ViewNumber: "1",
    NumberOfEventTimers: "1",
    NumberOfViewsInStage: "20",
    EventElapsedTimes: "3000",
    EventTimerNames: "STAGE TIME",
    StartTrim: "1",
    StopTrim: "8",
    PatientSize: null,
    PatientWeight: null,
    DeviceSerialNumber: null,
    SoftwareVersions: "1.06",
    TriggerTime: "0",
    FrameTimeVector: "33.333\\50.000\\33.333\\50.000\\50.000\\50.000\\33.333\\43.333",
    HeartRate: "150",
    SequenceOfUltrasoundRegions: [
      {
        RegionSpatialFormat: 0,
        RegionDataType: 0,
        RegionFlags: {{AQAAAA==}},
        RegionLocationMinX0: {{AAAAAA==}},
        RegionLocationMinY0: {{EAAAAA==}},
        RegionLocationMaxX1: {{PwEAAA==}},
        RegionLocationMaxY1: {{5wAAAA==}},
        PhysicalUnitsXDirection: 0,
        PhysicalUnitsYDirection: 0,
        PhysicalDeltaX: 1,
        PhysicalDeltaY: 1,
        ItemDelimitationItem: [
        ]
      },
      {
        RegionSpatialFormat: 1,
        RegionDataType: 1,
        RegionFlags: {{AQAAAA==}},
        RegionLocationMinX0: {{AAAAAA==}},
        RegionLocationMinY0: {{EAAAAA==}},
        RegionLocationMaxX1: {{PwEAAA==}},
        RegionLocationMaxY1: {{2QAAAA==}},
        ReferencePixelX0: 183,
        ReferencePixelY0: -82,
        PhysicalUnitsXDirection: 3,
        PhysicalUnitsYDirection: 3,
        ReferencePixelPhysicalValueX: 7.978201587906682e0,
        ReferencePixelPhysicalValueY: -3.5749318590620107e0,
        PhysicalDeltaX: -2.293750081863255e-1,
        PhysicalDeltaY: 2.293750081863255e-1,
        ItemDelimitationItem: [
        ]
      }
    ],
    TransducerType: "VECTOR_PHASED",
    PatientOrientation: null,
    PlanarConfiguration: 0,
    NumberOfFrames: "8",
    FrameIncrementPointer: "00181065",
    LossyImageCompression: "01",
    '7FDD0010': {{VFNDIFByaXZhdGUgR3JvdXAg}},
    '7FDD1030': null,
    '7FDD1090': null,
    '7FDF0010': {{QUNVU09OOjEuMi44NDAuMTEzNjgwLjEuMCA=}},
    '7FDF1000': {{NSA=}},
    '7FDF1001': {{BwA=}},
    '7FDF100D': {{MCA=}}
  }
}
```