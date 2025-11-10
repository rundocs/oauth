async function handler(request: Request) {
	const { pathname } = new URL(request.url);

	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		})
	}

	if (request.method === "POST" && pathname === "/access_token") {
		try {
			const {
				client_id,
				code,
				code_verifier,
			} = await request.json();

			const response = await fetch("https://github.com/login/oauth/access_token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					client_id,
					code,
					code_verifier,
					client_secret: Deno.env.get("CLIENT_SECRET"),
				}),
			});

			return Response.json(await response.json(), {
				status: response.status,
				headers: { "Access-Control-Allow-Origin": "*" },
			})
		} catch (error) {
			let message = "OAuth Server Error";
			if (error instanceof Error) {
				message = error.message;
			}
			return Response.json({ message }, {
				status: 500,
				headers: { "Access-Control-Allow-Origin": "*" },
			})
		}
	}

	return new Response("Not Found", { status: 404 })
}

Deno.serve(handler);
