import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const indentifier = uuidv4()

      async function handle() {
        const file = await fs.promises.open("tmp/users.json", 'r+')
        const fileContent = await file.readFile()
        let users = []
        if (fileContent.length != 0) users = JSON.parse(fileContent)

        users.push(indentifier)
        await file.writeFile(JSON.stringify(users))
        file.close()
        res.status(200).json(indentifier)
      }

      try {
        handle()
      } catch (e) {
        fs.open("tmp/users.json", "w", (err, fd) => fs.close(fd));
        handle()
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
