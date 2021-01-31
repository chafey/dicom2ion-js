
// TODO: Create a tool to generate this based on the DICOM Standard from https://github.com/innolitics/dicom-standard

const uidAttrs = new Map([
    ['00080016', 'SOPClassUID'],
    ['00080018', 'SOPInstanceUID'],
    ['0020000d', 'StudyUID'],
    ['0020000e', 'SeriesUID'],
    ['00020010', 'TransferSyntaxUID'],
    ['00200052', 'FrameOfReferenceUID'],
    ['00080014', 'InstanceCreatorUID'],
])

const patientAttrs = new Map([
    ['00100010', 'PatientName'],
    ['00100020', 'PatientId'],
    ['00100030', 'PatientBirthDate'],
    ['00100040', 'PatientSex'],
])

const studyAttrs = new Map([
    ['00081030', 'StudyDescription'],
    ['00181030', 'ProtocolName'],
    ['00080050', 'AccessionNumber'],
    ['00200010', 'StudyId'],
    ['00080020', 'StudyDate'],
    ['00080030', 'StudyTime'],
])

const seriesAttrs = new Map([
    ['0008103e', 'SeriesDescription'],
    ['00200011', 'SeriesNumber'],
    ['00080060', 'Modality'],
    ['00180015', 'BodyPart'],
    ['00080021', 'SeriesDate'],
    ['00080031', 'SeriesTime'],

])

const instanceAttrs = new Map([
    ['00200013', 'InstanceNumber'],
    ['00200012', 'AcquisitionNumber'],
    ['00080012', 'InstanceCreationDate'],
    ['00080013', 'InstanceCreationTime'],
    ['00080022', 'AcquisitionDate'],
    ['00080032', 'AcquisitionTime'],
    ['00080023', 'ContentDate'],
    ['00080033', 'ContentTime'],
    ['00080005', 'SpecificCharacterSet']
])

const imageAttrs = new Map([
    ['00280010', 'Rows'],
    ['00280011', 'Columns'],
    ['00280004', 'PhotometricInterpretation'],
    ['00080008', 'ImageType'],
    ['00280100', 'BitsAllocated'],
    ['00280101', 'BistStored'],
    ['00280102', 'HighBit'],
    ['00280103', 'PixelRepresentation'],
    ['00281053', 'RescaleSlope'],
    ['00281052', 'RescaleIntercept'],
    ['00200032', 'ImagePositionPatient'],
    ['00200037', 'ImageOrientationPatient'],
    ['00280030', 'PixelSpacing'],
    ['00280002', 'SamplesPerPixel'],
])


const equipmentAttrs = new Map([
    ['00080070', 'Manufacturer'],
    ['00081090', 'Model'],
    ['00081010', 'StationName'],
    ['00020016', 'AETitle'],
    ['00080080', 'InstituionName'],
    ['00080080', 'SoftwareVersion'],
    ['00020013', 'ImplementationVersionName']
])

const attrGroups = {
    uidAttrs,
    patientAttrs,
    studyAttrs,
    seriesAttrs,
    instanceAttrs,
    equipmentAttrs,
    imageAttrs
}

module.exports = attrGroups