const fs = require('fs');
const dateFormat = require('dateformat');
const fetch = require('node-fetch');

module.exports = {
  saveReport: (rawReport, type) => {
    let report = rawReport["csp-report"]
    let violatedDirective = report["violated-directive"]
    let root_cause = report["effective-directive"]
    let blockedUri = report["blocked-uri"]
    let scriptSample = report["script-sample"]
    let row = report["line-number"]
    let column = report["column-number"]
    let file = report["source-file"]
    let originalPolicy = report["original-policy"]
  
    let report_type = ""
    let explanation = ""
  
    if (violatedDirective == "script-src-elem" && blockedUri == "inline") {
      explanation = "Nonce value incorrect or non-existent"
      report_type = "CSP violation"
    } else if (violatedDirective == "script-src-attr" && blockedUri == "inline") {
      explanation = "Inline event hadlers not allowed to execute scripts"
      report_type = "CSP violation"
    } else if (violatedDirective == "script-src" && blockedUri == "eval") {
      explanation = "Unsafe eval function"
      report_type = "CSP violation"
    } else if (violatedDirective == "require-trusted-types-for") {
      let arr = scriptSample.split(" ")
      let cause = arr[1]
      if (arr[0] == "HTMLScriptElement") {
        explanation = `Trusted Types Violation: script tag requires Trusted Types, ${cause} attribute blocked`
      } else {
        explanation = `Trusted Types Violation: ${cause} attribute blocked, Trusted types required`
      }
  
      report_type = "Trusted Types violation"
    } else {
      root_cause = violatedDirective
      explanation = "Unknow violation"
      report_type = "Unknown violation"
    }
  
    var processed = {
      "type": report_type,
      "row": row,
      "column": column,
      "root_cause": root_cause,
      "original_report": report,
      "explanation": explanation,
      "sample_script": scriptSample,
      "original_policy": originalPolicy,
      "file": file,
      "violating_code" : ""
    }
  
    fetch(report['document-uri'])
      .then(res => res.text())
      .then(body => {
        let lines = body.split("\n")
        processed["violating_code"] = lines[row-1]
        console.log(lines[row-1])
        
        saveToFile(processed, rawReport['csp-report']["document-uri"].split("=")[1], type)
      })
      .catch(err =>{
        console.log(err);
        saveToFile(processed, rawReport['csp-report']["document-uri"].split("=")[1], type)
      });

    

    
  }
};

function saveToFile(report, id, type) {
    let report_to_save = JSON.stringify(report)
    directory_name = __dirname + '/reports/' + id
    // check if directory already exists
    if (!fs.existsSync(directory_name)) {
        fs.mkdir(directory_name, function (err) {
        if (err) {
            return console.log(err);
        }
        });
    }

    file_name = `${type}${dateFormat(Date.now(), "dd-mm-yyyy_h:MM:ss")}_rand${Math.floor((Math.random() * 5000) + 1)}'.json`
    fs.writeFile(directory_name + '/' + file_name, report_to_save, function (err) {
        if (err) {
        return console.log(err);
        }
    });

    const queue_file = __dirname + '/reports/table_queue.txt'

    let rawdata = fs.readFileSync(queue_file, 'utf8')
    var arr = (function(data) {
        try {
            if (rawdata.length == 0){return []}
            return rawdata.split(",");
        } catch (err) {
            console.log(err)
            return [];
        }
    })(rawdata)

    if (arr.includes(id)){
      return
    }

    console.log(arr)
    console.log(arr.length)
    if (arr.length > 4){
        arr.shift()
        arr.push(id)
    } else {
        arr.push(id)
    }

    fs.writeFile(queue_file, arr.toString(), function (err) {
        if (err) {
        return console.log(err);
        }
    });


}