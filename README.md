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
    uri: "file:///workspaces/dicom2ion-js/test/fixtures/I_000025.dcm"
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
    createdAt: 2021-02-02T10:08:16.545Z
  },
  dataSet: {
    StudyInstanceUID: "1.2.840.113857.113857.1829.105008",
    SeriesInstanceUID: "1.2.840.113857.113857.1829.105008.1",
    SOPInstanceUID: "1.2.840.113857.113857.1829.105008.1.26",
    SOPClassUID: "1.2.840.10008.5.1.4.1.1.3.1",
    PatientName: "WELLS^DARLA",
    PatientID: "99076",
    PatientBirthDate: null,
    PatientSex: "F",
    StudyDescription: "US FETAL SURVEY",
    ProtocolName: null,
    AccessionNumber: "CA0760826",
    StudyID: "UOSUR",
    StudyDate: "20111031",
    StudyTime: "1607",
    SeriesDescription: null,
    SeriesNumber: "1",
    Modality: "US",
    SeriesDate: "20111031",
    SeriesTime: "095642",
    InstanceNumber: "26",
    ContentDate: "20110802",
    ContentTime: "101200",
    ImageType: "DERIVED\\PRIMARY\\\\0001",
    Rows: 421,
    Columns: 552,
    BitsAllocated: 8,
    BitsStored: 8,
    HighBit: 7,
    PixelRepresentation: 0,
    SamplesPerPixel: 3,
    TransferSyntaxUID: "1.2.840.10008.1.2.4.50",
    PixelData: {
      dataOffset: 1994,
      length: 11732776,
      sha256: "3641f18e72b651fbdc5ba501566ea87ed8daac1d2c77465fd29e8bf2301ff7bd",
      fragments: [
        {
          offset: 0,
          position: 2554,
          length: 88930
        },
        {
          offset: 88938,
          position: 91492,
          length: 88254
        },
        {
          offset: 177200,
          position: 179754,
          length: 87198
        },
        {
          offset: 264406,
          position: 266960,
          length: 86644
        },
        {
          offset: 351058,
          position: 353612,
          length: 86552
        },
        {
          offset: 437618,
          position: 440172,
          length: 86440
        },
        {
          offset: 524066,
          position: 526620,
          length: 86608
        },
        {
          offset: 610682,
          position: 613236,
          length: 86580
        },
        {
          offset: 697270,
          position: 699824,
          length: 86652
        },
        {
          offset: 783930,
          position: 786484,
          length: 86686
        },
        {
          offset: 870624,
          position: 873178,
          length: 86622
        },
        {
          offset: 957254,
          position: 959808,
          length: 86346
        },
        {
          offset: 1043608,
          position: 1046162,
          length: 85942
        },
        {
          offset: 1129558,
          position: 1132112,
          length: 85732
        },
        {
          offset: 1215298,
          position: 1217852,
          length: 85320
        },
        {
          offset: 1300626,
          position: 1303180,
          length: 85114
        },
        {
          offset: 1385748,
          position: 1388302,
          length: 84828
        },
        {
          offset: 1470584,
          position: 1473138,
          length: 84842
        },
        {
          offset: 1555434,
          position: 1557988,
          length: 84448
        },
        {
          offset: 1639890,
          position: 1642444,
          length: 83970
        },
        {
          offset: 1723868,
          position: 1726422,
          length: 84258
        },
        {
          offset: 1808134,
          position: 1810688,
          length: 84296
        },
        {
          offset: 1892438,
          position: 1894992,
          length: 84660
        },
        {
          offset: 1977106,
          position: 1979660,
          length: 85012
        },
        {
          offset: 2062126,
          position: 2064680,
          length: 85196
        },
        {
          offset: 2147330,
          position: 2149884,
          length: 85536
        },
        {
          offset: 2232874,
          position: 2235428,
          length: 85810
        },
        {
          offset: 2318692,
          position: 2321246,
          length: 85764
        },
        {
          offset: 2404464,
          position: 2407018,
          length: 85414
        },
        {
          offset: 2489886,
          position: 2492440,
          length: 85206
        },
        {
          offset: 2575100,
          position: 2577654,
          length: 85002
        },
        {
          offset: 2660110,
          position: 2662664,
          length: 84810
        },
        {
          offset: 2744928,
          position: 2747482,
          length: 84942
        },
        {
          offset: 2829878,
          position: 2832432,
          length: 85104
        },
        {
          offset: 2914990,
          position: 2917544,
          length: 85126
        },
        {
          offset: 3000124,
          position: 3002678,
          length: 85544
        },
        {
          offset: 3085676,
          position: 3088230,
          length: 85686
        },
        {
          offset: 3171370,
          position: 3173924,
          length: 85652
        },
        {
          offset: 3257030,
          position: 3259584,
          length: 85650
        },
        {
          offset: 3342688,
          position: 3345242,
          length: 85820
        },
        {
          offset: 3428516,
          position: 3431070,
          length: 85880
        },
        {
          offset: 3514404,
          position: 3516958,
          length: 85910
        },
        {
          offset: 3600322,
          position: 3602876,
          length: 85952
        },
        {
          offset: 3686282,
          position: 3688836,
          length: 85972
        },
        {
          offset: 3772262,
          position: 3774816,
          length: 85786
        },
        {
          offset: 3858056,
          position: 3860610,
          length: 85686
        },
        {
          offset: 3943750,
          position: 3946304,
          length: 85940
        },
        {
          offset: 4029698,
          position: 4032252,
          length: 86120
        },
        {
          offset: 4115826,
          position: 4118380,
          length: 86166
        },
        {
          offset: 4202000,
          position: 4204554,
          length: 85790
        },
        {
          offset: 4287798,
          position: 4290352,
          length: 85518
        },
        {
          offset: 4373324,
          position: 4375878,
          length: 85746
        },
        {
          offset: 4459078,
          position: 4461632,
          length: 85966
        },
        {
          offset: 4545052,
          position: 4547606,
          length: 86174
        },
        {
          offset: 4631234,
          position: 4633788,
          length: 86246
        },
        {
          offset: 4717488,
          position: 4720042,
          length: 86268
        },
        {
          offset: 4803764,
          position: 4806318,
          length: 86004
        },
        {
          offset: 4889776,
          position: 4892330,
          length: 85934
        },
        {
          offset: 4975718,
          position: 4978272,
          length: 85796
        },
        {
          offset: 5061522,
          position: 5064076,
          length: 85932
        },
        {
          offset: 5147462,
          position: 5150016,
          length: 86132
        },
        {
          offset: 5233602,
          position: 5236156,
          length: 86050
        },
        {
          offset: 5319660,
          position: 5322214,
          length: 86026
        },
        {
          offset: 5405694,
          position: 5408248,
          length: 85796
        },
        {
          offset: 5491498,
          position: 5494052,
          length: 85840
        },
        {
          offset: 5577346,
          position: 5579900,
          length: 85964
        },
        {
          offset: 5663318,
          position: 5665872,
          length: 86282
        },
        {
          offset: 5749608,
          position: 5752162,
          length: 86714
        },
        {
          offset: 5836330,
          position: 5838884,
          length: 87148
        },
        {
          offset: 5923486,
          position: 5926040,
          length: 87346
        },
        {
          offset: 6010840,
          position: 6013394,
          length: 87320
        },
        {
          offset: 6098168,
          position: 6100722,
          length: 87112
        },
        {
          offset: 6185288,
          position: 6187842,
          length: 87080
        },
        {
          offset: 6272376,
          position: 6274930,
          length: 87040
        },
        {
          offset: 6359424,
          position: 6361978,
          length: 86924
        },
        {
          offset: 6446356,
          position: 6448910,
          length: 86860
        },
        {
          offset: 6533224,
          position: 6535778,
          length: 87008
        },
        {
          offset: 6620240,
          position: 6622794,
          length: 86776
        },
        {
          offset: 6707024,
          position: 6709578,
          length: 86602
        },
        {
          offset: 6793634,
          position: 6796188,
          length: 86424
        },
        {
          offset: 6880066,
          position: 6882620,
          length: 86524
        },
        {
          offset: 6966598,
          position: 6969152,
          length: 86118
        },
        {
          offset: 7052724,
          position: 7055278,
          length: 86108
        },
        {
          offset: 7138840,
          position: 7141394,
          length: 86010
        },
        {
          offset: 7224858,
          position: 7227412,
          length: 86044
        },
        {
          offset: 7310910,
          position: 7313464,
          length: 86160
        },
        {
          offset: 7397078,
          position: 7399632,
          length: 86468
        },
        {
          offset: 7483554,
          position: 7486108,
          length: 86550
        },
        {
          offset: 7570112,
          position: 7572666,
          length: 86492
        },
        {
          offset: 7656612,
          position: 7659166,
          length: 86266
        },
        {
          offset: 7742886,
          position: 7745440,
          length: 86086
        },
        {
          offset: 7828980,
          position: 7831534,
          length: 85818
        },
        {
          offset: 7914806,
          position: 7917360,
          length: 85590
        },
        {
          offset: 8000404,
          position: 8002958,
          length: 85758
        },
        {
          offset: 8086170,
          position: 8088724,
          length: 85944
        },
        {
          offset: 8172122,
          position: 8174676,
          length: 86086
        },
        {
          offset: 8258216,
          position: 8260770,
          length: 86228
        },
        {
          offset: 8344452,
          position: 8347006,
          length: 86222
        },
        {
          offset: 8430682,
          position: 8433236,
          length: 86140
        },
        {
          offset: 8516830,
          position: 8519384,
          length: 86292
        },
        {
          offset: 8603130,
          position: 8605684,
          length: 86488
        },
        {
          offset: 8689626,
          position: 8692180,
          length: 86596
        },
        {
          offset: 8776230,
          position: 8778784,
          length: 86710
        },
        {
          offset: 8862948,
          position: 8865502,
          length: 86940
        },
        {
          offset: 8949896,
          position: 8952450,
          length: 86884
        },
        {
          offset: 9036788,
          position: 9039342,
          length: 86986
        },
        {
          offset: 9123782,
          position: 9126336,
          length: 87036
        },
        {
          offset: 9210826,
          position: 9213380,
          length: 87040
        },
        {
          offset: 9297874,
          position: 9300428,
          length: 87136
        },
        {
          offset: 9385018,
          position: 9387572,
          length: 87198
        },
        {
          offset: 9472224,
          position: 9474778,
          length: 87050
        },
        {
          offset: 9559282,
          position: 9561836,
          length: 87190
        },
        {
          offset: 9646480,
          position: 9649034,
          length: 87260
        },
        {
          offset: 9733748,
          position: 9736302,
          length: 86628
        },
        {
          offset: 9820384,
          position: 9822938,
          length: 85982
        },
        {
          offset: 9906374,
          position: 9908928,
          length: 86342
        },
        {
          offset: 9992724,
          position: 9995278,
          length: 86330
        },
        {
          offset: 10079062,
          position: 10081616,
          length: 86458
        },
        {
          offset: 10165528,
          position: 10168082,
          length: 86760
        },
        {
          offset: 10252296,
          position: 10254850,
          length: 87106
        },
        {
          offset: 10339410,
          position: 10341964,
          length: 87216
        },
        {
          offset: 10426634,
          position: 10429188,
          length: 87190
        },
        {
          offset: 10513832,
          position: 10516386,
          length: 87190
        },
        {
          offset: 10601030,
          position: 10603584,
          length: 87048
        },
        {
          offset: 10688086,
          position: 10690640,
          length: 86558
        },
        {
          offset: 10774652,
          position: 10777206,
          length: 86580
        },
        {
          offset: 10861240,
          position: 10863794,
          length: 86690
        },
        {
          offset: 10947938,
          position: 10950492,
          length: 86876
        },
        {
          offset: 11034822,
          position: 11037376,
          length: 87132
        },
        {
          offset: 11121962,
          position: 11124516,
          length: 86992
        },
        {
          offset: 11208962,
          position: 11211516,
          length: 87048
        },
        {
          offset: 11296018,
          position: 11298572,
          length: 87010
        },
        {
          offset: 11383036,
          position: 11385590,
          length: 87256
        },
        {
          offset: 11470300,
          position: 11472854,
          length: 87362
        },
        {
          offset: 11557670,
          position: 11560224,
          length: 87384
        },
        {
          offset: 11645062,
          position: 11647616,
          length: 87146
        }
      ],
      basicOffsetTable: [
        0,
        88938,
        177200,
        264406,
        351058,
        437618,
        524066,
        610682,
        697270,
        783930,
        870624,
        957254,
        1043608,
        1129558,
        1215298,
        1300626,
        1385748,
        1470584,
        1555434,
        1639890,
        1723868,
        1808134,
        1892438,
        1977106,
        2062126,
        2147330,
        2232874,
        2318692,
        2404464,
        2489886,
        2575100,
        2660110,
        2744928,
        2829878,
        2914990,
        3000124,
        3085676,
        3171370,
        3257030,
        3342688,
        3428516,
        3514404,
        3600322,
        3686282,
        3772262,
        3858056,
        3943750,
        4029698,
        4115826,
        4202000,
        4287798,
        4373324,
        4459078,
        4545052,
        4631234,
        4717488,
        4803764,
        4889776,
        4975718,
        5061522,
        5147462,
        5233602,
        5319660,
        5405694,
        5491498,
        5577346,
        5663318,
        5749608,
        5836330,
        5923486,
        6010840,
        6098168,
        6185288,
        6272376,
        6359424,
        6446356,
        6533224,
        6620240,
        6707024,
        6793634,
        6880066,
        6966598,
        7052724,
        7138840,
        7224858,
        7310910,
        7397078,
        7483554,
        7570112,
        7656612,
        7742886,
        7828980,
        7914806,
        8000404,
        8086170,
        8172122,
        8258216,
        8344452,
        8430682,
        8516830,
        8603130,
        8689626,
        8776230,
        8862948,
        8949896,
        9036788,
        9123782,
        9210826,
        9297874,
        9385018,
        9472224,
        9559282,
        9646480,
        9733748,
        9820384,
        9906374,
        9992724,
        10079062,
        10165528,
        10252296,
        10339410,
        10426634,
        10513832,
        10601030,
        10688086,
        10774652,
        10861240,
        10947938,
        11034822,
        11121962,
        11208962,
        11296018,
        11383036,
        11470300,
        11557670,
        11645062
      ],
      encapsulatedPixelData: true
    },
    PhotometricInterpretation: "YBR_FULL_422",
    WindowCenter: "128",
    WindowWidth: "255",
    Manufacturer: "GE Healthcare",
    ManufacturerModelName: "LOGIQE9",
    StationName: "UCSF-L06",
    SourceApplicationEntityTitle: "AIUM1_SCP",
    InstitutionName: "UCSF *2",
    ImplementationVersionName: "MergeCOM3_320",
    FileMetaInformationGroupLength: {{uAAAAA==}},
    FileMetaInformationVersion: {{AAE=}},
    MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.3.1",
    MediaStorageSOPInstanceUID: "1.2.840.113857.113857.1829.105008.1.26",
    ImplementationClassUID: "2.16.840.1",
    InstitutionalDepartmentName: "Ultrasound",
    ReferencedStudySequence: [
      {
        ReferencedSOPClassUID: "1.2.840.10008.3.1.2.3.1",
        ReferencedSOPInstanceUID: "1.2.840.113745.101000.1150000.40750.6368.13308747"
      }
    ],
    ReferencedPatientSequence: [
      {
        ReferencedSOPClassUID: "1.2.840.10008.3.1.2.1.1",
        ReferencedSOPInstanceUID: "1.2.124.113532.192.9.54.60.20110728.151717.10584971"
      }
    ],
    StartTrim: "1",
    StopTrim: "136",
    RecommendedDisplayFrameRate: "45",
    PatientAge: "028Y",
    CineRate: "45",
    EffectiveDuration: "3.022222",
    SoftwareVersions: "LOGIQE9:R3.1.1",
    FrameTime: "22.152",
    FrameDelay: "0",
    HeartRate: "-1",
    ActualFrameDuration: "22",
    PreferredPlaybackSequencing: 0,
    SequenceOfUltrasoundRegions: [
      {
        RegionSpatialFormat: 1,
        RegionDataType: 1,
        RegionFlags: {{AAAAAA==}},
        RegionLocationMinX0: {{AAAAAA==}},
        RegionLocationMinY0: {{KgAAAA==}},
        RegionLocationMaxX1: {{JwIAAA==}},
        RegionLocationMaxY1: {{bQEAAA==}},
        ReferencePixelX0: 317,
        ReferencePixelY0: -124,
        PhysicalUnitsXDirection: 3,
        PhysicalUnitsYDirection: 3,
        ReferencePixelPhysicalValueX: 0,
        ReferencePixelPhysicalValueY: 0,
        PhysicalDeltaX: 1.975773102018352e-2,
        PhysicalDeltaY: 1.975773102018352e-2,
        TransducerFrequency: {{iBMAAA==}}
      }
    ],
    PatientOrientation: null,
    PlanarConfiguration: 0,
    NumberOfFrames: "136",
    FrameIncrementPointer: "00181063",
    UltrasoundColorDataPresent: 1,
    LossyImageCompression: "01",
    LossyImageCompressionRatio: "8.0",
    StudyStatusID: "READ",
    StudyPriorityID: "LOW",
    ReasonForStudy: "SCHED W/BEV X60445\n\nPREG W/POST MITRAL VALVES\n\n655.83",
    RequestingPhysician: "LEE^HANMIN^",
    CurrentPatientLocation: "PGSU",
    PerformedProtocolCodeSequence: [
      {
      }
    ],
    RequestedProcedureID: "7763504",
    '00290000': {{QgAAAA==}},
    '00290010': "ShowcaseAppearance",
    '00291012': "1.000000",
    '00291013': "100",
    '00291014': [
    ],
    '00310010': "MITRA LINKED ATTRIBUTES 1.0",
    '00310011': "AGFA PACS Archive Mirroring 1.0",
    '00311020': "52409233",
    '00311100': "r",
    '00311101': {{hjI4Tg==}},
    _vrs: {
      '00290000': "UL",
      '00290010': "LO",
      '00291012': "DS",
      '00291013': "DS",
      '00291014': "SQ",
      '00310010': "LO",
      '00310011': "LO",
      '00311020': "LO",
      '00311100': "CS",
      '00311101': "UL"
    }
  }
}
```