const orderedAttributes = [
    // UIDS
    '00080016', // SOP Class UID
    '00080018', // SOP Instance UID
    '0020000d', // Study UID
    '0020000e', // Series UID
    '00020010', // TransferSyntaxUID
    '00200052', // FrameOfReferenceUID
    '00080014', // InstanceCreatorUID
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
    '00080005', //'SpecificCharacterSet']
    // IMAGE
    '00280010', //'Rows'],
    '00280011', //'Columns'],
    '00280004', //'PhotometricInterpretation'],
    '00080008', //'ImageType'],
    '00280100', //'BitsAllocated'],
    '00280101', //'BistStored'],
    '00280102', //'HighBit'],
    '00280103', //'PixelRepresentation'],
    '00281053', //'RescaleSlope'],
    '00281052', //'RescaleIntercept'],
    '00200032', //'ImagePositionPatient'],
    '00200037', //'ImageOrientationPatient'],
    '00280030', //'PixelSpacing'],
    '00280002', //'SamplesPerPixel'],
    // EQUIPMENT
    '00080070', //'Manufacturer'],
    '00081090', //'Model'],
    '00081010', //'StationName'],
    '00020016', //'AETitle'],
    '00080080', //'InstituionName'],
    '00080080', //'SoftwareVersion'],
    '00020013', //'ImplementationVersionName']
]

module.exports = orderedAttributes