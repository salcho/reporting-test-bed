module.exports = {
    getDirectoryName: () => {

    },
    processReport: (reportJSON) => {
        function processReport(reportJSON){
            var report = reportJSON["csp-report"]
            var violatedDirective = report["violated-directive"]
            var root_cause = report["effective-directive"]
            var blockedUri = report["blocked-uri"]
            var scriptSample = report["script-sample"]
            var row = report["line-number"]
            var column = report["column-number"]
            var file = report["source-file"]
            var originalPolicy = report["original-policy"]
           
            var type = ""
            var explanation = ""
          
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
              var arr = scriptSample.split(" ")
              var cause = arr[1]
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
          
            var processed = {
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
    }
};