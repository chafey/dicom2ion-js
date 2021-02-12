const fs = require('fs');
const dicom2ion = require('../../src')
const path = require('path');
const ion = require("ion-js");

const main = async () => {

    if(process.argv.length < 4) {
        console.error("Usage: dicom2ion <source> <target>")
        console.error("dicom2ion converts DICOMP10 files to DAGCOM Ion format")
        console.error("")
        console.error("  <source> = directory containing input DICOM P10 files")
        console.error("  <target> = directory that resulting Ion files will be written")
        process.exit(-1)
    }

    fs.readdirSync(process.argv[2]).forEach(async(file) => {
        console.log('file=', file)
        const readable = fs.createReadStream(path.join(process.argv[2], file))
        const sourceInfo = {
            uri: 'file://' + path.join(process.cwd(), process.argv[2], file)
        }
        try {
            const result = await dicom2ion(readable, sourceInfo)
            const bin = ion.dumpBinary(result)
            const binPath =path.join(process.argv[3], file + '.ion')
            console.log('binPath=', binPath)
            fs.writeFileSync(binPath, bin, {encoding:'binary'})
            const txt = ion.dumpPrettyText(result)
            fs.writeFileSync(path.join(process.argv[3], file + '.text.ion'), txt, {encoding:'utf8'})
            process.stdout.write(".")
        }
        catch(ex) {
            console.log(ex + file)
        }
    });
    console.log('done')
}

main()