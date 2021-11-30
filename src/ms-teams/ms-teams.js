addEventListener("fetch", event => {
	const { request } = event
	if (request.method === "POST") {
	  return event.respondWith(handleRequest(request))
	}
	else if (request.method === "GET") {
	  return event.respondWith(new Response(`The request was a GET`))
	}
  })

async function handleRequest(request) {
  let pathname = new URL(request.url).pathname
  let reqBody;
  if(pathname == "/msteams"){
    reqBody = await msTeams(request)
  }
  const retBody = `The request body sent in was ${JSON.stringify(reqBody)}`
  return new Response(retBody)
}

export async function msTeams(request) {
    const { headers } = request
    const contentType = headers.get("content-type") || ""
    let msTeamsJSON = {
        "@context": "https://schema.org/extensions",
        "@type": "MessageCard",
        "themeColor": "0070C6",
        "title": "",
        "text": "",
        "potentialAction": [
            {
                "@type": "OpenUri",
                "name": "View incident",
                "targets": [
                    {
                        "os": "default",
                        "uri": ""
                    }
                ]
            }
        ]
    }
    if (contentType.includes("application/json")) {
        let bodyy = JSON.stringify(await request.json())
        bodyy = JSON.parse(bodyy)
        let title = ""
        let themeColor = ""
        let text = ""
        let serviceName = ""
        let alertSource = ""
        let url = ""
        if (bodyy.event_type == "incident_resolved") {
            title = "Resolved"
            themeColor = "16c26a"
        }
        else if (bodyy.event_type == "incident_reassigned") {
            title = "Reassigned"
            themeColor = "ab54ea"
        }
        else if (bodyy.event_type == "incident_acknowledged") {
            title = "Acknowledged"
            themeColor = "ecc40c"
        }
        else if (bodyy.event_type == "incident_triggered") {
            title = "Triggered"
            themeColor = "ab54ea"
        }
        serviceName = bodyy.service.name
        alertSource = bodyy.alert_source.type
        title = title + "\n\n" + bodyy.message
        text = "### Description \n\n" + bodyy.description + "\n\n**Service Name**:" + serviceName + "\n\n**Alert soure**: " + alertSource
        url = "https://app.squadcast.com/incident/" + bodyy.id
        msTeamsJSON.title = title
        msTeamsJSON.text = text
        msTeamsJSON.themeColor = themeColor
        msTeamsJSON.potentialAction[0].targets[0].uri = url
        let msteamsUrl = headers.get("msteamsurl")
        const init = {
            body: JSON.stringify(msTeamsJSON),
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
        }
        if (msteamsUrl != undefined) {
            msteamsUrl = msteamsUrl.split(",")
        }
        else{
            return "msteamsurl not found in header"
        }
        for (let url in msteamsUrl) {
            let temp_url = msteamsUrl[url].trim()
            if (temp_url.length > 0) {
                await fetch(temp_url, init)
            }
        }
        return msTeamsJSON
    }
    else {
        return 'a file';
    }
}