const fs = require("fs")

const deleteFile = (filePath) => {
    //**Unlink is a method to delete a file*/
    fs.unlink(filePath , (err) => {
        if (err) {
            throw (err);
        }
    })
}

exports.deleteFile = deleteFile;