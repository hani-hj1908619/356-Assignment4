import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const ideasPath = "/tmp/ideas.json"
  const usersPath = "/tmp/users.json"

  if (req.method === "GET") {
    try {
      const indentifier = uuidv4()

      let users = []
      try {
        const file = await fs.promises.readFile(usersPath);
        users = JSON.parse(file)
      } catch {
      }
      users.push(indentifier)
      fs.writeFileSync(usersPath, JSON.stringify(users))

      res.status(200).json(indentifier)
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  }
}
