// index.ts

import { Connection, routePartykitRequest, Server } from "partyserver";

// Define your Server
export class Voting extends Server {
	public votes: { [id: number]: number } = {};

  onConnect(connection) {
    console.log("Connected", connection.id, "to server", this.name);
  }

  onMessage(connection: Connection, message) {
    console.log("Message from", connection.id, ":", message);
		const data = JSON.parse(message);

		if(data.type === 'vote') {
			this.votes[data.id] = (this.votes[data.id] || 0) + 1;
			const result: any = JSON.stringify({ type: 'result', id: data.id, count: this.votes[data.id] });
			this.broadcast(result, []);
		} else if(data.type === 'data') {
			this.broadcast(JSON.stringify({
				type: 'data',
				initial: 1,
				votes: this.votes,
			}), []);
		}
    // Send the message to every other connection
    this.broadcast(message, []);
  }
}

export default {
  // Set up your fetch handler to use configured Servers
  fetch(request, env) {
    return (
      routePartykitRequest(request, env) ||
      new Response("Not Found", { status: 404 })
    );
  }
};
