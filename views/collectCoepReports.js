
r = new ReportingObserver(
    reports => reports.forEach(
        r => fetch(
            'http://localhost:3443/coep-reports',
            { method: 'POST', body: JSON.stringify(r.toJSON()) }
        ).then(rsp => console.log(rsp.text()))),
    { buffered: false }
);
r.observe();
