const orderedAttributes = [
    // UIDS
    '0020000d', // Study UID
    '0020000e', // Series UID
    '00080018', // SOP Instance UID
    // INSTANCE
    '00080016', // SOP Class UID
    '00080005', //'SpecificCharacterSet'
    // PATIENT
    '00100010', //'PatientName'],
    '00100020', //'PatientId'],
    '00100030', //'PatientBirthDate'],
    '00100040', //'PatientSex'],
    // STUDY
    '00081030', //'StudyDescription'],
    '00181030', //'ProtocolName'],
    '00080050', //'AccessionNumber'],
    '00200010', //'StudyId'],
    '00080020', //'StudyDate'],
    '00080030', //'StudyTime'],
    // SERIES
    '0008103e', //'SeriesDescription'],
    '00200011', //'SeriesNumber'],
    '00080060', //'Modality'],
    '00180015', //'BodyPart'],
    '00080021', //'SeriesDate'],
    '00080031', //'SeriesTime'],
    // INSTANCE
    '00200013', //'InstanceNumber'],
    '00200012', //'AcquisitionNumber'],
    '00080012', //'InstanceCreationDate'],
    '00080013', //'InstanceCreationTime'],
    '00080022', //'AcquisitionDate'],
    '00080032', //'AcquisitionTime'],
    '00080023', //'ContentDate'],
    '00080033', //'ContentTime'],
    '00080008', //'ImageType'],
    '00200062', //'ImageLaterality'],
    '00082218', // AnatomicRegionSequence

    // IMAGE
    '00280010', //'Rows'],
    '00280011', //'Columns'],
    '00280100', //'BitsAllocated'],
    '00280101', //'BistStored'],
    '00280102', //'HighBit'],
    '00280103', //'PixelRepresentation'],
    '00280002', //'SamplesPerPixel'],
    '00020010', // TransferSyntaxUID
    '00280008', // NumberOfFrames
    '7fe00010', // PixelData

    // Display Pipeline Related
    '00280120', // PixelPaddingValue
    '00280004', //'PhotometricInterpretation'],
    '00281053', //'RescaleSlope'],
    '00281052', //'RescaleIntercept'],
    '00281050', // window center
    '00281051', // window width

    // IMAGE SPATIAL
    '00200052', // FrameOfReferenceUID
    '00200032', //'ImagePositionPatient'],
    '00200037', //'ImageOrientationPatient'],
    '00280030', //'PixelSpacing'],

    // ENCAPSULATED FILES
    '00420011', // EncapsulatedDocument
    '00420012', // MIMETypeOfEncapsulatedDocument
    '00420014', // ListOfMIMETypes
    '00420015', // EncapsulatedDocumentLength,

    // EQUIPMENT
    '00080070', //'Manufacturer'],
    '00081090', //'Model'],
    '00081010', //'StationName'],
    '00020016', //'AETitle'],
    '00080080', //'InstituionName'],
    '00080080', //'SoftwareVersion'],
    '00020013', //'ImplementationVersionName']

    // OTHER FROM IHE RAD TF-2: Table 4.14-1
    // Study Level
    // '00080020', // Study Date
    // '00080030', // Study Time
    // '00080050', // Accession Number
    '00080051', // Issuer of Accession Number
    // '00100010', //'PatientName'],
    // '00100020', //'PatientId'],
    '00100021', // Issuer of Patient ID
    '00100024', // Issuer of Patient Qualifiers Sequence
    '00101002', // Other Patient IDs Sequence
    // '00200010', //'StudyId'],
    // '0020000d', // Study UID
    '00080090', // Referring Physician's Name
    // '00081030', //'StudyDescription'],
    '00081032', // Procedure Code Sequence
    '00081060', // Name of Physicians Reading Study
    '00081080', // Admitting Diagnosis Description
    '00081110', // Referenced Study Description
    '00081120', // Referenced Patient Sequence
    // '00100030', //'PatientBirthDate'],
    '00100032', //'PatientBirthTime'],
    // '00100040', //'PatientSex'],
    '00101000', // Other Patient IDs
    '00101001', // Other Patient Names
    '00101010', // Patient's Age
    '00101020', // Patient's Size
    '00101030', // Patient's Weight
    '00102160', // Ethnic Group
    '00102180', // Occupation
    '001021B0', // Additional Patient History
    '00104000', // Patient Comments
    '00201070', // Other Study Numbers
    '4008010C', // Interpretation Author
    // Series Level
    // '00080060', //'Modality'],
    // '00200011', //'SeriesNumber'],
    // '0020000e', // Series UID
    // '0008103e', //'SeriesDescription'],
    '00400253', // Performed Procedure Step ID
    '00081111', // Referenced Performed Procedure Step Sequence
    '00400275', // Request Attribute Sequence
    '00400244', // Performed Procedure Step Start Date
    '00400245', // Performed Procedure Step Start Time
    // '00180015', //'BodyPart'],
    // '00080080', //'InstituionName'],
    '00080081', // Institution Address
    '00080082', // Institution Code Sequence
    // Instance Level
    // '00080018', // SOP Instance UID
    // '00200013', //'InstanceNumber'],
    // '00080016', // SOP Class UID
    // Image Specific
    // '00280010', //'Rows'],
    // '00280011', //'Columns'],
    // '00280100', //'BitsAllocated'],
    // '00280008', // NumberOfFrames

    // Other Query attributes from DICOM PS3.4
    // Instance Level
    '0008001A', // Related General SOP Class UID
    '0040A043', // Concept Name Code Sequence
    '0040A504', // Content Template Sequence
    '00400512', // Container Identifier
    '00400560', // Specimen Description Sequence

    // Not represented in instance data, but may be requested in query
    // '00080061', // Modalities in Study
    // '00080062', // SOP Classes in Study
    // '00080063', // Anatomic Regions In Study Code Sequence
    // '00083001', // Alternate Representation Sequence
    // '00083002', // Available Tranfer Syntax UID
    // '00201200', // Number of Patient Related Studies
    // '00201202', // Number of Patient Related Series
    // '00201204', // Number of Patient Related Instances
    // '00201206', // Number of Study Related Series
    // '00201208', // Number of Study Related Instances
    // '00201209', // Number of Series Related Instances

module.exports = orderedAttributes