import fs from "fs";
import { validate as uuidValidate } from 'uuid';

export default async function handler(req, res) {
    const ideasPath = "/tmp/ideas.json"
    const usersPath = "/tmp/users.json"
    try {
        const { user } = req.query
        //Identifier validation
        let serverUsers = []
        try {
            const file = await fs.promises.readFile(usersPath);
            serverUsers = JSON.parse(file)
        } catch { }
        if (!uuidValidate(user) || !serverUsers.includes(user)) {
            return res.status(403).json({ "error": "Invalid identifier" })
        }

        let ideas = {}
        try {
            const file = await fs.promises.readFile(ideasPath);
            ideas = JSON.parse(file)
        } catch { }

        let userIdeas = ideas[user]
        if (!userIdeas) userIdeas = []

        if (req.method === "GET") {
            res.status(200).json({ "ideas": userIdeas })
        }
        else if (req.method === "POST") {
            userIdeas.push(JSON.parse(req.body))
            ideas[user] = userIdeas
            fs.writeFileSync(ideasPath, JSON.stringify(ideas))
            res.status(200).send()
        }
        else if (req.method === "DELETE") {
            const { index } = JSON.parse(req.body)
            userIdeas.splice(index, 1)
            ideas[user] = userIdeas
            fs.writeFileSync(ideasPath, JSON.stringify(ideas))
            res.status(200).send()
        }
    } catch (e) {
        // console.log(e);
        res.status(500).json({ error: e.message });
    }
}