import fs from "fs";
import { validate as uuidValidate } from 'uuid';

export default async function handler(req, res) {
    try {
        const { user } = req.query
        const file = await fs.promises.readFile("tmp/ideas.json");
        const ideas = JSON.parse(file)

        //Identifier validation
        if (!uuidValidate(user)) {
            return res.status(403).json({ "error": "Invalid identifier" })
        }

        let userIdeas = ideas[user]
        if (!userIdeas) userIdeas = []

        if (req.method === "GET") {
            res.status(200).json({ "ideas": userIdeas })
        }
        else if (req.method === "POST") {
            userIdeas.push(JSON.parse(req.body))
            ideas[user] = userIdeas
            fs.writeFileSync("tmp/ideas.json", JSON.stringify(ideas))
            res.status(200).send()
        }
        else if (req.method === "DELETE") {
            const { index } = JSON.parse(req.body)
            userIdeas.splice(index, 1)
            ideas[user] = userIdeas
            fs.writeFileSync("tmp/ideas.json", JSON.stringify(ideas))
            res.status(200).send()
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}