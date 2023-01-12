import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const indentifier = uuidv4()

      const file = await fs.promises.readFile("./tmp/users.json");
      const users = JSON.parse(file)
      users.push(indentifier)
      fs.writeFileSync("./tmp/users.json", JSON.stringify(users))

      res.status(200).json(indentifier)
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
