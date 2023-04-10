import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

const streamChat = StreamChat.getInstance(
	process.env.STREAM_API_KEY!,
	process.env.STREAM_PRIVATE_KEY!
);

const TOKEN_USER_ID_MAP = new Map<string, string>();

export async function userRoutes(app: FastifyInstance) {
	app.post<{ Body: { id: string; name: string; image?: string } }>(
		"/signup",
		async (req, res) => {
			const { id, name, image } = req.body;

			if (!id || !name) {
				return res
					.status(400)
					.send({ error: "Username and Name are required" });
			}

			// check for existing user
			const existingUsers = await streamChat.queryUsers({ id });
			if (existingUsers.users.length < 0) {
				return res.status(400).send({ error: "User ID taken" });
			}

			// create new user
			streamChat.upsertUser({ id, name, image });
			return res.status(201).send({ message: "User created" });
		}
	);

	app.post<{ Body: { id: string } }>("/login", async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res.status(400).send({ error: "username is required" });
		}

		// check for existing user
		const {
			users: [user],
		} = await streamChat.queryUsers({ id });
		if (!user) return res.status(401).send({ error: "Authentication failed" });

		const token = streamChat.createToken(id);
		TOKEN_USER_ID_MAP.set(token, user.id);

		return res.status(200).send({
			token,
			user: { name: user.name, id: user.id, image: user.image },
		});
	});

	app.post<{ Body: { token: string } }>("/logout", async (req, res) => {
		const token = req.body.token;
		if (token == null || token === "") return res.status(400).send();

		const id = TOKEN_USER_ID_MAP.get(token);
		if (id == null) return res.status(400).send();

		await streamChat.revokeUserToken(id, new Date());
		TOKEN_USER_ID_MAP.delete(token);
	});
}
