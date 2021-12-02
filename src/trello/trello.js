export async function trello(request) {
    const { headers } = request
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        let bodyy = JSON.stringify(await request.json())
        bodyy = JSON.parse(bodyy)
        let name = ""
        let message = ""
        let serviceName = ""
        let alertSource = ""
        let url = ""
        url = "https://app.squadcast.com/incident/" + bodyy.id
        if (bodyy.event_type == "incident_resolved") {
            name = "[Resolved] "
        }
        else if (bodyy.event_type == "incident_reassigned") {
            name = "[Reassigned] "
        }
        else if (bodyy.event_type == "incident_acknowledged") {
            name = "[Acknowledged] "
        }
        else if (bodyy.event_type == "incident_triggered") {
            name = "[Triggered] "
        }
        serviceName = bodyy.service.name
        alertSource = bodyy.alert_source.type
        name = name + bodyy.message
        message = "\n**Service Name**:" + serviceName + "\n**Alert soure**: " + alertSource +"\n"+ bodyy.description+"**Incident URL**: "+url
        message = message.replace(/\n+/g, "\n")
        message = message.replace(/\*\*/g, "")
        name = name.replace(/\n+/g, "")
        let trellokey = headers.get("trellokey")
        let trellotoken = headers.get("trellotoken")
        let trelloidlist = headers.get("trelloidlist")
        if (trellokey == undefined || trellotoken == undefined || trelloidlist == undefined) {
            return "trellokey, trellotoken and trelloidlist not found in header"
        }
        const init = {
            method: "POST"
        }
        const urll="https://api.trello.com/1/cards?"+"key="+trellokey+"&token="+trellotoken+"&idList="+trelloidlist+"&name="+name+"&desc="+message
        if (trellokey == undefined || trellotoken == undefined || trelloidlist == undefined) {
            return "trellokey, trellotoken and trelloidlist not found in header"
        }
        else{
            await fetch(urll, init)
        }
        return "trello ticket created!!"
    }
    else {
        return 'a file';
    }
}