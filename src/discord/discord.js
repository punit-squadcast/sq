export async function discord(request) {
    const { headers } = request
    const contentType = headers.get("content-type") || ""
    let discorJson = {
        "embeds": [
            {
                "description": ""
            }
        ]
    }
    if (contentType.includes("application/json")) {
        let bodyy = JSON.stringify(await request.json())
        bodyy = JSON.parse(bodyy)
        let title = ""
        let description = ""
        let serviceName = ""
        let alertSource = ""
        let url = ""
        url = "https://app.squadcast.com/incident/" + bodyy.id
        if (bodyy.event_type == "incident_resolved") {
            title = "**Resolved **"+"[**#"+bodyy.id+"**]("+url+")\n"
        }
        else if (bodyy.event_type == "incident_reassigned") {
            title = "**Reassigned** "+"[#**"+bodyy.id+"**]("+url+")\n"
        }
        else if (bodyy.event_type == "incident_acknowledged") {
            title = "**Acknowledged **"+"[#**"+bodyy.id+"**]("+url+")\n"
        }
        else if (bodyy.event_type == "incident_triggered") {
            title = "**Triggered **"+"[#**"+bodyy.id+"**]("+url+")\n"
        }
        serviceName = bodyy.service.name
        alertSource = bodyy.alert_source.type
        title = title + bodyy.message
        description = "\n**Service Name**:" + serviceName + "\n**Alert soure**: " + alertSource +"\n"+ bodyy.description
        description = description.replace(/\n+/g, "\n")
        title = title.replace(/\n+/g, "\n")
        description = description.replace(/\*\*/g, "")
        discorJson.embeds[0].description = title+description
        let discordUrl = headers.get("discordurl")
        const init = {
            body: JSON.stringify(discorJson),
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
        }
        if (discordUrl != undefined) {
            discordUrl = discordUrl.split(",")
        }
        else{
            return "discordurl not found in header"
        }
        for (let url in discordUrl) {
            let temp_url = discordUrl[url].trim()
            if (temp_url.length > 0) {
                await fetch(temp_url, init)
            }
        }
        return discorJson
    }
    else {
        return 'a file';
    }
}