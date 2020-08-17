const fs = require('fs');
const dateFormat = require('dateformat');

module.exports = {
    saveReport: (rawReport, type) => {
        let report = JSON.stringify(rawReport)
        directory_name =__dirname + '/reports/'+ rawReport['csp-report']["document-uri"].split("=")[1]
        // check if directory already exists
        if (!fs.existsSync(directory_name)) {
          fs.mkdir(directory_name,function (err) {
            if (err) {
              return console.log(err);
            }
          });
        }
    
        file_name = `${type}${dateFormat(Date.now(), "dd-mm-yyyy_h:MM:ss")}_rand${Math.floor((Math.random() * 5000) + 1)}'.json`
        fs.writeFile(directory_name + '/' + file_name, report, function (err) {
          if (err) {
            return console.log(err);
          }
        });
    },
    processReport: (reportJSON) => {
        let report = reportJSON["csp-report"]
        let violatedDirective = report["violated-directive"]
        let root_cause = report["effective-directive"]
        let blockedUri = report["blocked-uri"]
        let scriptSample = report["script-sample"]
        let row = report["line-number"]
        let column = report["column-number"]
        let file = report["source-file"]
        let originalPolicy = report["original-policy"]
        
        let type = ""
        let explanation = ""
        
        if (violatedDirective == "script-src-elem" && blockedUri == "inline"){
            explanation = "Nonce value incorrect or non-existent"
            type = "CSP violation"
        } else if (violatedDirective == "script-src-attr" && blockedUri == "inline"){
            explanation = "Inline event hadlers not allowed to execute scripts"
            type = "CSP violation"
        } else if (violatedDirective == "script-src" && blockedUri == "eval"){
            explanation = "Unsafe eval function"
            type = "CSP violation"
        } else if (violatedDirective == "require-trusted-types-for"){
            let arr = scriptSample.split(" ")
            let cause = arr[1]
            if (arr[0]=="HTMLScriptElement"){
            explanation = `Trusted Types Violation: script tag requires Trusted Types, ${cause} attribute blocked`
            } else{
            explanation = `Trusted Types Violation: ${cause} attribute blocked, Trusted types required`
            }
        
            type = "Trusted Types violation"
        } else{
            root_cause = violatedDirective
            explanation = "Unknow violation"
            type = "Unknown violation"
        }
        
        let processed = {
            "type": type,
            "row": row,
            "column": column,
            "root_cause" : root_cause,
            "original_report" : report,
            "explanation" : explanation,
            "sample_script" : scriptSample,
            "original_policy": originalPolicy,
            "file": file
        } 
        
        console.log(processed)
        return processed;
    }
};