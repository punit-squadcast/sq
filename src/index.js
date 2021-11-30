
import {msTeams} from './ms-teams/ms-teams.js'
import { slack } from './slack/slack.js'
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
  if(pathname == "/slack"){
    reqBody = await slack(request)
  }
  const retBody = `The request body sent in was ${JSON.stringify(reqBody)}`
  return new Response(retBody)
}
