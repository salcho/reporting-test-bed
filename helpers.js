module.exports = {
    getDirectoryName: () => {

    },
    processReport: (reportJSON) => {
        var processed = {
            "root_cause" : "",
            "original_report" : reportJSON,
            "explanation" : "",
            "sample_script" : "",
            "fix" : ""
        }
        return processed;
    }
};