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
- 

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
  fileInfo: {
    sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6"
  },
  dataSet: {
    groups: {
      uidAttrs: {
        TransferSyntaxUID: "1.2.840.10008.1.2.1",
        InstanceCreatorUID: "1.3.6.1.4.1.5962.3",
        SOPClassUID: "1.2.840.10008.5.1.4.1.1.2",
        SOPInstanceUID: "1.3.6.1.4.1.5962.1.1.1.1.1.20040826185059.5457",
        StudyUID: "1.3.6.1.4.1.5962.1.2.1.20040826185059.5457",
        SeriesUID: "1.3.6.1.4.1.5962.1.3.1.1.20040826185059.5457",
        FrameOfReferenceUID: "1.3.6.1.4.1.5962.1.4.1.1.20040826185059.5457"
      },
      imageAttrs: {
        ImageType: "ORIGINAL\\PRIMARY\\AXIAL",
        ImagePositionPatient: "-158.135803\\-179.035797\\-75.699997",
        ImageOrientationPatient: "1.000000\\0.000000\\0.000000\\0.000000\\1.000000\\0.000000",
        SamplesPerPixel: 1,
        PhotometricInterpretation: "MONOCHROME2",
        Rows: 512,
        Columns: 512,
        PixelSpacing: "0.661468\\0.661468",
        BitsAllocated: 16,
        BistStored: 16,
        HighBit: 15,
        PixelRepresentation: 1,
        RescaleIntercept: "-1024",
        RescaleSlope: "1"
      },
      patientAttrs: {
        PatientName: "CompressedSamples^CT1",
        PatientId: "1CT1",
        PatientBirthDate: null,
        PatientSex: "O"
      },
      studyAttrs: {
        StudyDate: "20040826",
        StudyTime: "185059",
        AccessionNumber: null,
        StudyDescription: "e+1",
        StudyId: "1CT1"
      },
      seriesAttrs: {
        SeriesDate: "19970430",
        SeriesTime: "112749",
        Modality: "CT",
        SeriesNumber: "1"
      },
      instanceAttrs: {
        SpecificCharacterSet: "ISO_IR 100",
        InstanceCreationDate: "20040826",
        InstanceCreationTime: "185100",
        AcquisitionDate: "19970430",
        ContentDate: "19970430",
        AcquisitionTime: "112936",
        ContentTime: "113008",
        AcquisitionNumber: "2",
        InstanceNumber: "1"
      },
      equipmentAttrs: {
        ImplementationVersionName: "DCTOOL100",
        AETitle: "CLUNIE1",
        Manufacturer: "GE MEDICAL SYSTEMS",
        SoftwareVersion: "JFK IMAGING CENTER",
        StationName: "CT01_OC0",
        Model: "RHAPSODE"
      }
    },
    standardAttrs: {
      '00020000': {{vgAAAA==}},
      '00020001': {{AAE=}},
      '00020002': "1.2.840.10008.5.1.4.1.1.2",
      '00020003': "1.3.6.1.4.1.5962.1.1.1.1.1.20040826185059.5457",
      '00020012': "1.3.6.1.4.1.5962.2",
      '00080090': null,
      '00080201': "-0400",
      '00101010': "000Y",
      '00101030': "0.000000",
      '001021b0': null,
      '00180010': "ISOVUE300/100",
      '00180022': "HELICAL MODE",
      '00180050': "5.000000",
      '00180060': "120",
      '00180088': "5.000000",
      '00180090': "480.000000",
      '00181020': "05",
      '00181040': "IV",
      '00181100': "338.671600",
      '00181110': "1099.3100585938",
      '00181111': "630.000000",
      '00181120': "0.000000",
      '00181130': "133.699997",
      '00181150': "1601",
      '00181151': "170",
      '00181152': "170",
      '00181160': "LARGE BOWTIE FIL",
      '00181190': "0.700000",
      '00181210': "STANDARD",
      '00185100': "FFS",
      '00200060': null,
      '00201040': "SN",
      '00201041': "-77.2040634155",
      '00204000': "Uncompressed",
      '00280120': -2000,
      '7fe00010': {
        dataOffset: 6206,
        length: 524288,
        vr: "OW",
        sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6"
      },
      fffcfffc: {{CgD+AAQAAQAAAAAAAAAAAQQAAQAAAAACAAABAQQAAQAAAAACAAACAQMAAQAAABAAAAADAQMAAQAAAAEAAAAGAQMAAQAAAAEAAAARAQQAAQAAAD4YAAAVAQMAAQAAAAEAAAAWAQQAAQAAAAACAAAXAQQAAQAAAAAACAAAAAAA}}
    },
    privateAttrs: {
      '00090010': "GEMS_IDEN_01",
      '00091001': "GE_GENESIS_FF",
      '00091002': "CT01",
      '00091004': "HiSpeed CT/i",
      '00091027': 862399669,
      '00091030': null,
      '00091031': null,
      '000910e6': "05",
      '000910e7': {{TSIDOg==}},
      '000910e9': 862399669,
      '00110010': "GEMS_PATI_01",
      '00111010': 0,
      '00190010': "GEMS_ACQU_01",
      '00191002': 912,
      '00191003': "373.750000",
      '00191004': "1.016600",
      '0019100f': "955.799988",
      '00191011': 2,
      '00191013': 0,
      '00191014': 0,
      '00191015': 0,
      '00191016': 0,
      '00191017': 2,
      '00191018': "S",
      '00191019': "7.791870",
      '0019101a': "I",
      '0019101b': "-320.197968",
      '0019101e': "0.000000",
      '00191023': "5.000000",
      '00191024': "17.784578",
      '00191025': 1,
      '00191026': 0,
      '00191027': "1.000000",
      '0019102a': "178.079926",
      '0019102b': "3994.299316",
      '0019102c': 10431,
      '0019102e': "-718.079956",
      '0019102f': "984.000000",
      '00191039': 16,
      '00191040': 0,
      '00191041': 1,
      '00191042': 0,
      '00191043': 0,
      '00191044': "1.000000",
      '00191047': 1,
      '0019104a': 6,
      '0019104b': 10431,
      '00191052': 1,
      '00191057': -95,
      '00191058': 0,
      '0019105e': 763,
      '0019105f': 1,
      '00191060': 1969,
      '00191061': 1576,
      '00191062': 1,
      '0019106a': 4,
      '0019106b': 852,
      '00191070': 1,
      '00191071': 0,
      '00191072': "0.000000",
      '00191073': "0.000000",
      '00191074': "0.000000",
      '00191075': "0.000000",
      '00191076': "0.000000",
      '001910da': 0,
      '001910db': "0.000000",
      '001910dc': 1,
      '001910dd': 1,
      '001910de': "0.000000",
      '00210010': "GEMS_RELA_01",
      '00211003': 2,
      '00211005': "05",
      '00211007': {{KS+2Xw==}},
      '00211015': 24078,
      '00211016': 2,
      '00211018': "05",
      '00211019': {{Mma+LA==}},
      '00211037': 16,
      '0021104a': null,
      '00211090': 7400,
      '00211091': 0,
      '00211092': 0,
      '00211093': 0,
      '00230010': "GEMS_STDY_01",
      '00231070': 8.62399761111079e8,
      '00231074': 1,
      '0023107d': 0,
      '00250010': "GEMS_SERS_01",
      '00251006': 0,
      '00251007': 44,
      '00251010': 0,
      '00251011': 0,
      '00251017': 0,
      '00251018': 0,
      '00251019': 4,
      '0025101a': null,
      '00270010': "GEMS_IMAG_01",
      '00271006': 1,
      '00271010': 0,
      '0027101c': 150,
      '0027101d': 1,
      '0027101e': 24,
      '0027101f': 129,
      '00271020': 1,
      '00271030': null,
      '00271035': 2,
      '00271040': "I",
      '00271041': -7.720406341552734e1,
      '00271042': -1.1199999809265137e1,
      '00271043': 9.699999809265137e0,
      '00271044': -7.569999694824219e1,
      '00271045': 0,
      '00271046': 0,
      '00271047': -1,
      '00271048': -1.8053579711914062e2,
      '00271049': 1.7903579711914062e2,
      '0027104a': -7.569999694824219e1,
      '0027104b': -1.8053579711914062e2,
      '0027104c': -1.5963580322265625e2,
      '0027104d': -7.569999694824219e1,
      '00271050': -6.319999694824219e1,
      '00271051': -1.1620304870605469e2,
      '00271052': "L",
      '00271053': "A",
      '00271054': "I",
      '00271055': "I",
      '00290010': "GEMS_IMPS_01",
      '00291004': 0,
      '00291005': "0.000000",
      '00291006': "0.000000",
      '00291007': 87,
      '00291008': null,
      '00291009': null,
      '0029100a': 764,
      '00291026': 2,
      '00291034': 0,
      '00291035': 0,
      '00430010': "GEMS_PARM_01",
      '00431010': 400,
      '00431011': 10431,
      '00431012': {{DgACAAMA}},
      '00431013': {{awAVAAQAAgAUAA==}},
      '00431014': {{BAAEAAUA}},
      '00431015': 10431,
      '00431016': 0,
      '00431017': "0.095000",
      '00431018': "0.085000\\1.102000\\0.095000",
      '00431019': 350,
      '0043101a': 7,
      '0043101b': {{AAAAAAAAAAAAAA==}},
      '0043101c': 0,
      '0043101d': 40,
      '0043101e': "2.000000",
      '0043101f': 0,
      '00431020': "0.000000",
      '00431021': 0,
      '00431025': {{AQACAAMA7ALtAu4C}},
      '00431026': {{AAABAAEAAAAAAAAA}},
      '00431027': "/1.0:1",
      '00431028': {{Q1QwMQAAAEhpU3BlZWQgQ1QvaQAwNTA1ejo9fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=}},
      '00431029': {
        dataOffset: 3854,
        length: 2068,
        vr: "OB",
        sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6"
      },
      '0043102a': {{Q1QwMQAAAEhpU3BlZWQgQ1QvaQAwNTA1ejo9fAAAAAAAAAAAAAAAAA==}},
      '0043102b': {{BAAEAAAAAAA=}},
      '00431031': "-11.200000\\9.700000",
      '00431040': 1.7807992553710938e2,
      '00431041': 3.816219482421875e3,
      '00431042': 0,
      '00431043': 0,
      '00431044': 1,
      '00431045': 1,
      '00431046': 3,
      '00431047': -1,
      '00431048': 1,
      '00431049': 0,
      '0043104a': 1,
      '0043104b': 0,
      '0043104c': 0,
      '0043104d': 0,
      '0043104e': 1.060060977935791e1
    },
    vrs: {
      '00090010': "LO",
      '00091001': "LO",
      '00091002': "SH",
      '00091004': "SH",
      '00091027': "SL",
      '00091030': "SH",
      '00091031': "SH",
      '000910e6': "SH",
      '000910e7': "UL",
      '000910e9': "SL",
      '00110010': "LO",
      '00111010': "SS",
      '00190010': "LO",
      '00191002': "SL",
      '00191003': "DS",
      '00191004': "DS",
      '0019100f': "DS",
      '00191011': "SS",
      '00191013': "SS",
      '00191014': "SS",
      '00191015': "SS",
      '00191016': "SS",
      '00191017': "SS",
      '00191018': "LO",
      '00191019': "DS",
      '0019101a': "LO",
      '0019101b': "DS",
      '0019101e': "DS",
      '00191023': "DS",
      '00191024': "DS",
      '00191025': "SS",
      '00191026': "SL",
      '00191027': "DS",
      '0019102a': "DS",
      '0019102b': "DS",
      '0019102c': "SL",
      '0019102e': "DS",
      '0019102f': "DS",
      '00191039': "SS",
      '00191040': "SS",
      '00191041': "SS",
      '00191042': "SS",
      '00191043': "SS",
      '00191044': "DS",
      '00191047': "SS",
      '0019104a': "SS",
      '0019104b': "SL",
      '00191052': "SS",
      '00191057': "SS",
      '00191058': "SS",
      '0019105e': "SL",
      '0019105f': "SL",
      '00191060': "SL",
      '00191061': "SL",
      '00191062': "SL",
      '0019106a': "SS",
      '0019106b': "SS",
      '00191070': "SS",
      '00191071': "SS",
      '00191072': "DS",
      '00191073': "DS",
      '00191074': "DS",
      '00191075': "DS",
      '00191076': "DS",
      '001910da': "SS",
      '001910db': "DS",
      '001910dc': "SS",
      '001910dd': "SS",
      '001910de': "DS",
      '00210010': "LO",
      '00211003': "SS",
      '00211005': "SH",
      '00211007': "UL",
      '00211015': "US",
      '00211016': "SS",
      '00211018': "SH",
      '00211019': "UL",
      '00211037': "SS",
      '0021104a': "LO",
      '00211090': "SS",
      '00211091': "SS",
      '00211092': "FL",
      '00211093': "FL",
      '00230010': "LO",
      '00231070': "FD",
      '00231074': "SL",
      '0023107d': "SS",
      '00250010': "LO",
      '00251006': "SS",
      '00251007': "SL",
      '00251010': "SL",
      '00251011': "SS",
      '00251017': "SL",
      '00251018': "SL",
      '00251019': "SL",
      '0025101a': "SH",
      '00270010': "LO",
      '00271006': "SL",
      '00271010': "SS",
      '0027101c': "SL",
      '0027101d': "SS",
      '0027101e': "SL",
      '0027101f': "SL",
      '00271020': "SS",
      '00271030': "SH",
      '00271035': "SS",
      '00271040': "SH",
      '00271041': "FL",
      '00271042': "FL",
      '00271043': "FL",
      '00271044': "FL",
      '00271045': "FL",
      '00271046': "FL",
      '00271047': "FL",
      '00271048': "FL",
      '00271049': "FL",
      '0027104a': "FL",
      '0027104b': "FL",
      '0027104c': "FL",
      '0027104d': "FL",
      '00271050': "FL",
      '00271051': "FL",
      '00271052': "SH",
      '00271053': "SH",
      '00271054': "SH",
      '00271055': "SH",
      '00290010': "LO",
      '00291004': "SL",
      '00291005': "DS",
      '00291006': "DS",
      '00291007': "SL",
      '00291008': "SH",
      '00291009': "SH",
      '0029100a': "SS",
      '00291026': "SS",
      '00291034': "SL",
      '00291035': "SL",
      '00430010': "LO",
      '00431010': "US",
      '00431011': "US",
      '00431012': "SS",
      '00431013': "SS",
      '00431014': "SS",
      '00431015': "SS",
      '00431016': "SS",
      '00431017': "DS",
      '00431018': "DS",
      '00431019': "SS",
      '0043101a': "SL",
      '0043101b': "SS",
      '0043101c': "SS",
      '0043101d': "SS",
      '0043101e': "DS",
      '0043101f': "SL",
      '00431020': "DS",
      '00431021': "SS",
      '00431025': "SS",
      '00431026': "US",
      '00431027': "SH",
      '00431028': "OB",
      '00431029': "OB",
      '0043102a': "OB",
      '0043102b': "SS",
      '00431031': "DS",
      '00431040': "FL",
      '00431041': "FL",
      '00431042': "SL",
      '00431043': "SL",
      '00431044': "SL",
      '00431045': "SL",
      '00431046': "SL",
      '00431047': "SL",
      '00431048': "SL",
      '00431049': "SL",
      '0043104a': "SS",
      '0043104b': "SL",
      '0043104c': "SS",
      '0043104d': "FL",
      '0043104e': "FL"
    }
  }
}
```