const fs = require('fs');
const dateFormat = require('dateformat');
const fetch = require('node-fetch');
const UAParser = require('ua-parser-js');

module.exports = {
  saveReport: (req, type) => {
    const rawReport = req.body
    const { browser } = UAParser(req.get('User-Agent'))
    const browser_string = browser.name + "/" + browser.version
    //if it's a coep report, just save for now,
    // we're going to implement the processing soon!
    if (type == 'coep_') {
      saveToFile(rawReport, rawReport['url'].split("=")[1], 'coep_', browser_string)
      return;
    }

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
      "violating_code": "",
      "browser": browser_string
    }

    fetch(report['document-uri'])
      .then(res => res.text())
      .then(body => {
        let lines = body.split("\n")
        processed["violating_code"] = lines[row - 1]
        console.log(lines[row - 1])

        saveToFile(processed, rawReport['csp-report']["document-uri"].split("=")[1], type, browser_string)
      })
      .catch(err => {
        console.log(err);
        saveToFile(processed, rawReport['csp-report']["document-uri"].split("=")[1], type, browser_string)
      });
  }
};

function saveToFile(report, id, type, browser) {
  let report_to_save = JSON.stringify(report)
  directory_name = __dirname + '/reports/' + id
  var now = Date.now();

  // check if directory already exists
  if (!fs.existsSync(directory_name)) {
    fs.mkdir(directory_name, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    writeToQueueFile(id, now, browser)
  }

  file_name = `${type}${dateFormat(now, "dd-mm-yyyy_h:MM:ss")}_rand${Math.floor((Math.random() * 5000) + 1)}'.json`
  fs.writeFile(directory_name + '/' + file_name, report_to_save, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function writeToQueueFile(id, now, browser) {
  const queue_file = __dirname + '/reports/table_queue.json'
  
  var arr;
  if (!fs.existsSync(queue_file)) {
    arr = []
  } else {
    arr = JSON.parse(fs.readFileSync(queue_file))
  }

  var formSubmitObj = {
    id : id,
    date : dateFormat(now, "h:MM dd-mm-yyyy"),
    browser: browser
  }
  console.log(arr)
  console.log(arr.length)
  if (arr.length > 10) {
    arr.shift()
    arr.push(formSubmitObj)
  } else {
    arr.push(formSubmitObj)
  }

  fs.writeFile(queue_file, JSON.stringify(arr), function (err) {
    if (err) {
      return console.log(err);
    }
  });
}