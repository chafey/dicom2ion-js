# dicom2ion-js
JavaScript implementation of a DICOM P10 converter to [Amazon Ion](https://amzn.github.io/ion-docs/)

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

## Building

This project uses Visual Studio Remote Containers to simplify setup and running (everything is contained in a docker image)

This project uses git submodules to pull in the test data for unit tests.  If developing, initialize the git submodules first:

```
> $ git submodule update --init --recursive
```

Make sure you install npm dependencies:

```
> npm install
```

To run the unit tests, run the VS Code Build task or run manually from cli:
```
> npm test
```

## Examples

The examples/dicom2ion directory contains the source for a cli that will batch convert DICOM P10 to ION for a folder

## Design Thoughts:

- Support async iterator as input so we can design for a full streaming implementation
- Make the attribute->value as simple and lightweight as possible (basically TAG=VALUE)
- Preserve the VRs in the original DICOM P10, but only the ones we don't already know (private vrs and multi-vr attributes)
- Use human friendly (Keyword) names for attributes (rather than group/element)
- Order attributes so the most common ones are first
- Must be possible to regenerate DICOM P10 from ION Format.  Ideally bit for bit lossless, but semantic equivalence is acceptable
- Store the sha256 digest of the original DICOM P10 so we can very integrity later
- Store the sha256 for each referenced data item so we can verify integrity later

### Input Parameters
- Stream to source DICOM P10
- Source Info (optional)
  - uri to source DICOM P10 file
  - creation date
  - modification date
- Encoding Algorithm Parameters (optional)
  - privateAttributeMaxInlineLength - defaults to 256
  - standardAttributeMaxInlineLength - defaults to 256
  - data dictionary to use

### Returns async interable stream with ion data

### Output Schema
- Attribute Ordering
  - Enables faster parsing/lookups 
  - Private attributes put at the end
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
    uri: "file:///workspaces/dicom2ion-js/test/fixtures/CT0012.fragmented_no_bot_jpeg_ls.80.dcm"
  },
  options: {
    maximumInlineDataLength: 256,
    dataDictionary: {
      description: "Unknown edition",
      sha256: "c2e30d6191b63d67a9a0606da204e00968286bfe1f94c2ccd2dcf9b8d33ebf4b"
    }
  },
  fileInfo: {
    sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6",
    createdAt: 2021-02-03T21:22:54.051Z
  },
  dataSet: {
    StudyInstanceUID: "1.3.6.1.4.1.5962.1.2.10.1166562673.14401",
    SeriesInstanceUID: "1.3.6.1.4.1.5962.1.3.10.3.1166562673.14401",
    SOPInstanceUID: "1.3.6.1.4.1.5962.1.1.10.3.1.1166562673.14401",
    SOPClassUID: "1.2.840.10008.5.1.4.1.1.2.1",
    SpecificCharacterSet: "ISO_IR 100",
    PatientName: "Perfusion^MCA Stroke",
    PatientID: "0010",
    PatientBirthDate: "19500704",
    PatientSex: "M",
    StudyDescription: null,
    AccessionNumber: "0010",
    StudyID: "0010",
    StudyDate: "20061219",
    StudyTime: "111154.812",
    SeriesDescription: null,
    SeriesNumber: "3",
    Modality: "CT",
    SeriesDate: "20061219",
    SeriesTime: "110929.984",
    InstanceNumber: "1",
    AcquisitionNumber: "1",
    InstanceCreationDate: "20061219",
    InstanceCreationTime: "202309",
    ContentDate: "20061219",
    ContentTime: "110930.671",
    ImageType: "DERIVED\\PRIMARY\\PERFUSION\\RCBF",
    Rows: 512,
    Columns: 512,
    BitsAllocated: 16,
    BitsStored: 16,
    HighBit: 15,
    PixelRepresentation: 0,
    SamplesPerPixel: 1,
    TransferSyntaxUID: "1.2.840.10008.1.2.4.80",
    NumberOfFrames: "2",
    PixelData: {
      dataOffset: 3920,
      length: 85672,
      sha256: "600138c2a369ce2d25dc0842c0a9f634bd8ad0ec09b208c067d020fc71b659bb",
      encapsulatedPixelData: true,
      basicOffsetTable: [
      ],
      fragments: [
        {
          offset: 0,
          position: 3936,
          length: 8192
        },
        {
          offset: 8200,
          position: 12136,
          length: 8192
        },
        {
          offset: 16400,
          position: 20336,
          length: 8192
        },
        {
          offset: 24600,
          position: 28536,
          length: 8192
        },
        {
          offset: 32800,
          position: 36736,
          length: 8192
        },
        {
          offset: 41000,
          position: 44936,
          length: 5448
        },
        {
          offset: 46456,
          position: 50392,
          length: 8192
        },
        {
          offset: 54656,
          position: 58592,
          length: 8192
        },
        {
          offset: 62856,
          position: 66792,
          length: 8192
        },
        {
          offset: 71056,
          position: 74992,
          length: 8192
        },
        {
          offset: 79256,
          position: 83192,
          length: 6392
        }
      ]
    },
    PhotometricInterpretation: "MONOCHROME2",
    FrameOfReferenceUID: "1.3.6.1.4.1.5962.1.4.10.1.1166562673.14401",
    Manufacturer: "Acme Medical Devices",
    ManufacturerModelName: "Super Dooper Scanner",
    StationName: "CONSOLE01",
    SourceApplicationEntityTitle: "CLUNIE1",
    InstitutionName: "St. Nowhere Hospital",
    ImplementationVersionName: "OFFIS_DCMTK_361",
    FileMetaInformationGroupLength: {{0AAAAA==}},
    FileMetaInformationVersion: {{AAE=}},
    MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.2.1",
    MediaStorageSOPInstanceUID: "1.3.6.1.4.1.5962.1.1.10.3.1.1166562673.14401",
    ImplementationClassUID: "1.2.276.0.7230010.3.0.3.6.1",
    InstanceCreatorUID: "1.3.6.1.4.1.5962.3",
    ReferringPhysicianName: "Thomas^Albert",
    TimezoneOffsetFromUTC: "-0500",
    PerformingPhysicianName: "Smith^John",
    NameOfPhysiciansReadingStudy: "Smith^John",
    OperatorsName: "Jones^Molly",
    ReferencedRawDataSequence: [
      {
        StudyInstanceUID: "1.3.6.1.4.1.5962.1.2.10.1166562673.14401",
        ReferencedSeriesSequence: [
          {
            SeriesInstanceUID: "1.3.6.1.4.1.5962.1.3.10.3.1166562673.14401",
            ReferencedSOPSequence: [
              {
                ReferencedSOPClassUID: "1.2.840.10008.5.1.4.1.1.66",
                ReferencedSOPInstanceUID: "1.3.6.1.4.1.5962.1.9.10.1.1166562673.14401"
              }
            ]
          }
        ]
      }
    ],
    PixelPresentation: "COLOR",
    VolumetricProperties: "VOLUME",
    VolumeBasedCalculationTechnique: "NONE",
    PatientAge: "052Y",
    PatientSize: "1.6",
    PatientWeight: "75",
    ContrastBolusAgentSequence: [
      {
        CodeValue: "C-B0322",
        CodingSchemeDesignator: "SRT",
        CodeMeaning: "Iohexol",
        ContrastBolusAdministrationRouteSequence: [
          {
            CodeValue: "G-D101",
            CodingSchemeDesignator: "SNM3",
            CodeMeaning: "Intravenous route"
          }
        ],
        ContrastBolusVolume: "150",
        ContrastBolusIngredientConcentration: "300",
        ContrastBolusAgentNumber: 1,
        ContrastBolusIngredientCodeSequence: [
          {
            CodeValue: "C-11400",
            CodingSchemeDesignator: "SRT",
            CodeMeaning: "Iodine"
          }
        ]
      }
    ],
    DeviceSerialNumber: "123456",
    SoftwareVersions: "1.00",
    PatientPosition: "HFS",
    ContentQualification: "PRODUCT",
    PositionReferenceIndicator: null,
    DimensionOrganizationSequence: [
      {
        DimensionOrganizationUID: "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401"
      }
    ],
    DimensionIndexSequence: [
      {
        DimensionOrganizationUID: "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401",
        DimensionIndexPointer: "00209056",
        FunctionalGroupPointer: "00209111"
      },
      {
        DimensionOrganizationUID: "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401",
        DimensionIndexPointer: "00209057",
        FunctionalGroupPointer: "00209111"
      }
    ],
    BurnedInAnnotation: "NO",
    RedPaletteColorLookupTableDescriptor: {{ZAAABBAA}},
    GreenPaletteColorLookupTableDescriptor: {{ZAAABBAA}},
    BluePaletteColorLookupTableDescriptor: {{ZAAABBAA}},
    RedPaletteColorLookupTableData: {{AAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEBAgIDAwRTB+MKcw4EEpQVJBm1HEUg1SNmJ/YqhS0WMaY0NzhUPHE/6EJ4RghKmU0CUR9USVfZWnZelWO0aNJtMnTge4+CPYrqkJiYR6D1p6OvUbf/vq3GW86i1bbcZOQS7MDzbfr+/j////////////8=}},
    GreenPaletteColorLookupTableData: {{AAEAAQABAAEAAQABAAEAAQABAAGAAQ8EBQZUCL4MUBGuFcsZ6h6VIycoRCxiMIE1njm9PttC+UcXTDZRVFVxWZBermLLZulqCHAldEN4Yn2AgJ+Fvordj/uUGpqHoDSn4a2btLu73MKWyUPQ8Nad3X7k9+qk8dz1+fkY//////////////////////////////////////////////////////////////////////////////////////////////////////8=}},
    BluePaletteColorLookupTableData: {{AAE9C3kUtx6VMENEvFc2a3wXN5Cjox23/sqd3bXo8/Mx/v////////////////////////////////////////////////////////////////////////////////////8L/3397/uR91Tuy+Qb22zSY8kmwF63rq5ypTac+ZLwiUGBRHkIcMtmj11TVBZL2kHEOBUwqCmJJGsfAx6SICIjWSeUL9E4DEGISTdSv1r9ZDtw+Xq4hPWONJpxpK+v7bnRxGjOpNc=}},
    LossyImageCompression: "00",
    AcquisitionContextSequence: [
    ],
    PresentationLUTShape: "IDENTITY",
    SharedFunctionalGroupsSequence: [
      {
        CTImageFrameTypeSequence: [
          {
            FrameType: "DERIVED\\PRIMARY\\PERFUSION\\RCBF",
            PixelPresentation: "COLOR",
            VolumetricProperties: "VOLUME",
            VolumeBasedCalculationTechnique: "NONE"
          }
        ],
        ContrastBolusUsageSequence: [
          {
            ContrastBolusAgentNumber: 1,
            ContrastBolusAgentAdministered: "YES",
            ContrastBolusAgentDetected: "YES",
            ContrastBolusAgentPhase: "DYNAMIC"
          }
        ],
        IrradiationEventIdentificationSequence: [
          {
            IrradiationEventUID: "1.3.6.1.4.1.5962.1.10.10.3.1.1166562673.14401"
          }
        ],
        FrameAnatomySequence: [
          {
            AnatomicRegionSequence: [
              {
                CodeValue: "T-A0100",
                CodingSchemeDesignator: "SNM3",
                CodeMeaning: "Brain"
              }
            ],
            FrameLaterality: "U"
          }
        ],
        PlaneOrientationSequence: [
          {
            ImageOrientationPatient: "-1.00000\\0.00000\\0.00000\\0.00000\\1.00000\\0.00000"
          }
        ],
        PixelMeasuresSequence: [
          {
            PixelSpacing: "0.388672\\0.388672",
            SliceThickness: "10.0000"
          }
        ],
        FrameVOILUTSequence: [
          {
            WindowCenter: "49.0000",
            WindowWidth: "102.000"
          }
        ],
        PixelValueTransformationSequence: [
          {
            RescaleSlope: "1.00000",
            RescaleIntercept: "-1024.00",
            RescaleType: "US"
          }
        ],
        RealWorldValueMappingSequence: [
          {
            LUTExplanation: "Regional Cerebral Blood Flow",
            MeasurementUnitsCodeSequence: [
              {
                CodeValue: "ml/100ml/s",
                CodingSchemeDesignator: "UCUM",
                CodingSchemeVersion: "1.4",
                CodeMeaning: "ml/100ml/s"
              }
            ],
            LUTLabel: "RCBF",
            RealWorldValueLastValueMapped: 4095,
            RealWorldValueFirstValueMapped: 0,
            RealWorldValueIntercept: -1024,
            RealWorldValueSlope: 1
          }
        ]
      }
    ],
    PerFrameFunctionalGroupsSequence: [
      {
        FrameContentSequence: [
          {
            StackID: "1",
            InStackPositionNumber: {{AgAAAA==}},
            FrameAcquisitionNumber: 1,
            DimensionIndexValues: {{AQAAAAIAAAA=}}
          }
        ],
        PlanePositionSequence: [
          {
            ImagePositionPatient: "99.5000\\-301.500\\-159.000"
          }
        ]
      },
      {
        FrameContentSequence: [
          {
            StackID: "1",
            InStackPositionNumber: {{AQAAAA==}},
            FrameAcquisitionNumber: 1,
            DimensionIndexValues: {{AQAAAAEAAAA=}}
          }
        ],
        PlanePositionSequence: [
          {
            ImagePositionPatient: "99.5000\\-301.500\\-149.000"
          }
        ]
      }
    ]
  }
}
```