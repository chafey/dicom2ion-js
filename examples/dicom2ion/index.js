const fs = require('fs');
const dicom2ion = require('../../src')
const path = require('path');
const ion = require("ion-js");

const main = async () => {

    fs.readdirSync(process.argv[2]).forEach(async(file) => {
        const readable = fs.createReadStream(path.join(process.argv[2], file))
        const sourceInfo = {
            uri: 'file://' + path.join(process.cwd(), process.argv[2], file)
        }
        try {
            const result = await dicom2ion(readable, sourceInfo)
            const bin = ion.dumpBinary(result)
            fs.writeFileSync(path.join(process.argv[3], file + '.ion'), bin, {encoding:'binary'})
            const txt = ion.dumpPrettyText(result)
            fs.writeFileSync(path.join(process.argv[3]+'.text', file + '.ion'), txt, {encoding:'utf8'})
            process.stdout.write(".")
        }
        catch(ex) {
            console.log(ex + file)
        }
    });
    console.log('done')
}

main()