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
  fileInfo: {
    sha256: "dc3ff8e550c833236bbee92d163762698b7b0b7b68a1af1b060243580741b7a6"
  },
  dataSet: {
    groups: {
      uidAttrs: {
        TransferSyntaxUID: "1.2.840.10008.1.2.1",
        InstanceCreatorUID: "1.3.6.1.4.1.5962.3",
        SOPClassUID: "1.2.840.10008.5.1.4.1.1.2.1",
        SOPInstanceUID: "1.3.6.1.4.1.5962.1.1.10.3.1.1166562673.14401",
        StudyUID: "1.3.6.1.4.1.5962.1.2.10.1166562673.14401",
        SeriesUID: "1.3.6.1.4.1.5962.1.3.10.3.1166562673.14401",
        FrameOfReferenceUID: "1.3.6.1.4.1.5962.1.4.10.1.1166562673.14401"
      },
      imageAttrs: {
        ImageType: "DERIVED\\PRIMARY\\PERFUSION\\RCBF",
        SamplesPerPixel: 1,
        PhotometricInterpretation: "MONOCHROME2",
        Rows: 512,
        Columns: 512,
        BitsAllocated: 16,
        BistStored: 16,
        HighBit: 15,
        PixelRepresentation: 0
      },
      patientAttrs: {
        PatientName: "Perfusion^MCA Stroke",
        PatientId: "0010",
        PatientBirthDate: "19500704",
        PatientSex: "M"
      },
      studyAttrs: {
        StudyDate: "20061219",
        StudyTime: "111154.812",
        AccessionNumber: "0010",
        StudyDescription: null,
        StudyId: "0010"
      },
      seriesAttrs: {
        SeriesDate: "20061219",
        SeriesTime: "110929.984",
        Modality: "CT",
        SeriesDescription: null,
        SeriesNumber: "3"
      },
      instanceAttrs: {
        SpecificCharacterSet: "ISO_IR 100",
        InstanceCreationDate: "20061219",
        InstanceCreationTime: "202309",
        ContentDate: "20061219",
        ContentTime: "110930.671",
        AcquisitionNumber: "1",
        InstanceNumber: "1"
      },
      equipmentAttrs: {
        ImplementationVersionName: "DCTOOL100",
        AETitle: "CLUNIE1",
        Manufacturer: "Acme Medical Devices",
        SoftwareVersion: "St. Nowhere Hospital",
        StationName: "CONSOLE01",
        Model: "Super Dooper Scanner"
      }
    },
    standardAttrs: {
      '20500020': "IDENTITY",
      '52009229': [
        {
          standardAttrs: {
            '00189329': [
              {
                standardAttrs: {
                  '00089007': "DERIVED\\PRIMARY\\PERFUSION\\RCBF",
                  '00089205': "COLOR",
                  '00089206': "VOLUME",
                  '00089207': "NONE",
                  fffee00d: null
                }
              }
            ],
            '00189341': [
              {
                standardAttrs: {
                  '00189337': 1,
                  '00189342': "YES",
                  '00189343': "YES",
                  '00189344': "DYNAMIC",
                  fffee00d: null
                }
              }
            ],
            '00189477': [
              {
                standardAttrs: {
                  '00083010': "1.3.6.1.4.1.5962.1.10.10.3.1.1166562673.14401",
                  fffee00d: null
                }
              }
            ],
            '00209071': [
              {
                standardAttrs: {
                  '00082218': [
                    {
                      standardAttrs: {
                        '00080100': "T-A0100",
                        '00080102': "SNM3",
                        '00080104': "Brain",
                        fffee00d: null
                      }
                    }
                  ],
                  '00209072': "U",
                  fffee00d: null
                }
              }
            ],
            '00209116': [
              {
                groups: {
                  imageAttrs: {
                    ImageOrientationPatient: "-1.00000\\0.00000\\0.00000\\0.00000\\1.00000\\0.00000"
                  }
                },
                standardAttrs: {
                  fffee00d: null
                }
              }
            ],
            '00289110': [
              {
                groups: {
                  imageAttrs: {
                    PixelSpacing: "0.388672\\0.388672"
                  }
                },
                standardAttrs: {
                  '00180050': "10.0000",
                  fffee00d: null
                }
              }
            ],
            '00289132': [
              {
                standardAttrs: {
                  '00281050': "49.0000",
                  '00281051': "102.000",
                  fffee00d: null
                }
              }
            ],
            '00289145': [
              {
                groups: {
                  imageAttrs: {
                    RescaleIntercept: "-1024.00",
                    RescaleSlope: "1.00000"
                  }
                },
                standardAttrs: {
                  '00281054': "US",
                  fffee00d: null
                }
              }
            ],
            '00409096': [
              {
                standardAttrs: {
                  '00283003': "Regional Cerebral Blood Flow",
                  '004008ea': [
                    {
                      standardAttrs: {
                        '00080100': "ml/100ml/s",
                        '00080102': "UCUM",
                        '00080103': "1.4",
                        '00080104': "ml/100ml/s",
                        fffee00d: null
                      }
                    }
                  ],
                  '00409210': "RCBF",
                  '00409211': 4095,
                  '00409216': 0,
                  '00409224': -1024,
                  '00409225': 1,
                  fffee00d: null
                }
              }
            ],
            fffee00d: null
          }
        }
      ],
      '52009230': [
        {
          standardAttrs: {
            '00209111': [
              {
                standardAttrs: {
                  '00209056': "1",
                  '00209057': {{AgAAAA==}},
                  '00209156': 1,
                  '00209157': {{AQAAAAIAAAA=}},
                  fffee00d: null
                }
              }
            ],
            '00209113': [
              {
                groups: {
                  imageAttrs: {
                    ImagePositionPatient: "99.5000\\-301.500\\-159.000"
                  }
                },
                standardAttrs: {
                  fffee00d: null
                }
              }
            ],
            fffee00d: null
          }
        },
        {
          standardAttrs: {
            '00209111': [
              {
                standardAttrs: {
                  '00209056': "1",
                  '00209057': {{AQAAAA==}},
                  '00209156': 1,
                  '00209157': {{AQAAAAEAAAA=}},
                  fffee00d: null
                }
              }
            ],
            '00209113': [
              {
                groups: {
                  imageAttrs: {
                    ImagePositionPatient: "99.5000\\-301.500\\-149.000"
                  }
                },
                standardAttrs: {
                  fffee00d: null
                }
              }
            ],
            fffee00d: null
          }
        }
      ],
      '00020000': {{vgAAAA==}},
      '00020001': {{AAE=}},
      '00020002': "1.2.840.10008.5.1.4.1.1.2.1",
      '00020003': "1.3.6.1.4.1.5962.1.1.10.3.1.1166562673.14401",
      '00020012': "1.3.6.1.4.1.5962.2",
      '00080090': "Thomas^Albert",
      '00080201': "-0500",
      '00081050': "Smith^John",
      '00081060': "Smith^John",
      '00081070': "Jones^Molly",
      '00089121': [
        {
          groups: {
            uidAttrs: {
              StudyUID: "1.3.6.1.4.1.5962.1.2.10.1166562673.14401"
            }
          },
          standardAttrs: {
            '00081115': [
              {
                groups: {
                  uidAttrs: {
                    SeriesUID: "1.3.6.1.4.1.5962.1.3.10.3.1166562673.14401"
                  }
                },
                standardAttrs: {
                  '00081199': [
                    {
                      standardAttrs: {
                        '00081150': "1.2.840.10008.5.1.4.1.1.66",
                        '00081155': "1.3.6.1.4.1.5962.1.9.10.1.1166562673.14401",
                        fffee00d: null
                      }
                    }
                  ],
                  fffee00d: null
                }
              }
            ],
            fffee00d: null
          }
        }
      ],
      '00089205': "COLOR",
      '00089206': "VOLUME",
      '00089207': "NONE",
      '00101010': "052Y",
      '00101020': "1.6",
      '00101030': "75",
      '00180012': [
        {
          standardAttrs: {
            '00080100': "C-B0322",
            '00080102': "SRT",
            '00080104': "Iohexol",
            '00180014': [
              {
                standardAttrs: {
                  '00080100': "G-D101",
                  '00080102': "SNM3",
                  '00080104': "Intravenous route",
                  fffee00d: null
                }
              }
            ],
            '00181041': "150",
            '00181049': "300",
            '00189337': 1,
            '00189338': [
              {
                standardAttrs: {
                  '00080100': "C-11400",
                  '00080102': "SRT",
                  '00080104': "Iodine",
                  fffee00d: null
                }
              }
            ],
            fffee00d: null
          }
        }
      ],
      '00181000': "123456",
      '00181020': "1.00",
      '00185100': "HFS",
      '00189004': "PRODUCT",
      '00201040': null,
      '00209221': [
        {
          standardAttrs: {
            '00209164': "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401",
            fffee00d: null
          }
        }
      ],
      '00209222': [
        {
          standardAttrs: {
            '00209164': "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401",
            '00209165': "00209056",
            '00209167': "00209111",
            fffee00d: null
          }
        },
        {
          standardAttrs: {
            '00209164': "1.3.6.1.4.1.5962.1.6.10.3.0.1166562673.14401",
            '00209165': "00209057",
            '00209167': "00209111",
            fffee00d: null
          }
        }
      ],
      '00280008': "2",
      '00280301': "NO",
      '00281101': {{ZAAABBAA}},
      '00281102': {{ZAAABBAA}},
      '00281103': {{ZAAABBAA}},
      '00281201': {{AAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEBAgIDAwRTB+MKcw4EEpQVJBm1HEUg1SNmJ/YqhS0WMaY0NzhUPHE/6EJ4RghKmU0CUR9USVfZWnZelWO0aNJtMnTge4+CPYrqkJiYR6D1p6OvUbf/vq3GW86i1bbcZOQS7MDzbfr+/j////////////8=}},
      '00281202': {{AAEAAQABAAEAAQABAAEAAQABAAGAAQ8EBQZUCL4MUBGuFcsZ6h6VIycoRCxiMIE1njm9PttC+UcXTDZRVFVxWZBermLLZulqCHAldEN4Yn2AgJ+Fvordj/uUGpqHoDSn4a2btLu73MKWyUPQ8Nad3X7k9+qk8dz1+fkY//////////////////////////////////////////////////////////////////////////////////////////////////////8=}},
      '00281203': {{AAE9C3kUtx6VMENEvFc2a3wXN5Cjox23/sqd3bXo8/Mx/v////////////////////////////////////////////////////////////////////////////////////8L/3397/uR91Tuy+Qb22zSY8kmwF63rq5ypTac+ZLwiUGBRHkIcMtmj11TVBZL2kHEOBUwqCmJJGsfAx6SICIjWSeUL9E4DEGISTdSv1r9ZDtw+Xq4hPWONJpxpK+v7bnRxGjOpNc=}},
      '00282110': "00",
      '00400555': [
      ],
      '7fe00010': {
        dataOffset: 4326,
        length: 1048576,
        sha256: "97cacf1749d8cbd981124299075ac27585e275a2f8b1b74b5321c60ff92acedd",
        vr: "OW"
      }
    }
  }
}
```