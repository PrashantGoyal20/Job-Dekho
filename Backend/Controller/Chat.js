import ErrorHandler from "../Middleware/error.js"
import dotenv from "dotenv";
import axios from "axios"
import { QdrantClient } from "@qdrant/js-client-rest";
import { pipeline } from "@xenova/transformers";
import { v5 as uuidv5 } from 'uuid'
import { v4 as uuidv4 } from 'uuid'
import { GoogleGenAI } from "@google/genai"


dotenv.config();

const QDRANT_URL = process.env.Qdrant_url;
const COLLECTION = process.env.Qdrant_Collection;
const QDRANT_API_KEY = process.env.Qdrant_api_key;
const VECTOR_DIMENSION = 384
const UUID_NAMESPACE = process.env.UUID_NAMESPACE;
let chatSession
let context = ''

const models = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY
})

// const HF_HEADERS = {
//     Authorization: `Bearer ${process.env.HF_API_KEY}`,
//     "Content-Type": "application/json",
// };

export async function upsertToQdrant(id, vector, payload) {
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION);

    if (!exists) {
        console.log(`🛠️ Creating collection: "${COLLECTION}"`);
        await client.createCollection(COLLECTION, {
            vectors: {
                size: VECTOR_DIMENSION,
                distance: "Cosine",
            },
        });
    }

    vector = Array.from(vector)
    id = uuidv5(String(id), UUID_NAMESPACE);

    return axios.put(
        `${QDRANT_URL}/collections/${COLLECTION}/points`,
        {
            points: [
                {
                    id: id,
                    vector: vector,
                    payload: {
                        payload
                    },
                },
            ],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'api-key': QDRANT_API_KEY,
            },
        }
    );
}

export async function deleteFromQdrant(id) {
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION);

    if (!exists) {
        console.log(`🛠️ Creating collection: "${COLLECTION}"`);
        await client.createCollection(COLLECTION, {
            vectors: {
                size: VECTOR_DIMENSION,
                distance: "Cosine",
            },
        });
    }
    id = uuidv5(String(id), UUID_NAMESPACE);

    return axios.post(
        `${QDRANT_URL}/collections/${COLLECTION}/points/delete`,
        {
            points: [id],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'api-key': QDRANT_API_KEY,
            },
        }
    );
}


export async function getEmbedding(text) {
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    const output = await embedder(text, {
        pooling: 'mean',
        normalize: true,
    });
    return output.data
}

export const chat_starter = async (req, res, next) => {
    try {
        const { start } = req.body;

        const user = `You are a Job Councellor as well as a help desk manager for a big multi-national job-portal company  Job-Dekho that can tell about company or job details but not any information about apllicants.\n\n 
                        If your are ever to anything about comapny name its name is Job Dekho (very important).
                        If u don't have any data simply reply u don't know politely.
                        If the user is confused about their future your task is to guide them to a right direction for successfull job growth.
                        Use this data provided to answer those question but remember don't leak any sensitive information line  .
                        Try to keep ans short for about 2-3 lines only.
                        Keep your tone polite and formal
                        \n\n${context}\n\n`;

        chatSession = models.chats.create({
            model: "gemini-2.5-flash",
            history: [
                {
                    role: 'user',
                    parts: [{ text: user }],
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood! I'm ready to assist you." }],
                },
            ],
        });
        res.status(200).json({
            success: true,
            message: "chat started"
        })
    } catch (error) {
        console.log(error)
    }
}


export const chat = async (req, res, next) => {
    try {
        const { query } = req.body
        if (!query) {
            return new ErrorHandler("Ask Question First", 400)
        }
        console.log('start')
        const vector = await getEmbedding(query);

        const reformedvector = Array.from(vector)
        const collections = await client.getCollections();
        const response = await axios.post(`${QDRANT_URL}/collections/${COLLECTION}/points/search`,
            {
                vector: reformedvector,
                limit: 5,
                with_payload: true
            },
            {
                headers: {
                    'api-key': process.env.QDRANT_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('found vectors')
        context = ""

        if (Object.keys(response.data.result).length > 0) {
            const docs = response.data.result.map((item) => Object.entries(item.payload)
                .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                .join(' | '));
            context = docs.join("\n\n");
        }


        const result = await chatSession.sendMessage({ message: query.toString()});
        const reply = result.text;
        res.status(200).json({
            success: true,
            ans: reply,
        });

    } catch (error) {
        console.log(error.response?.data)
    }

}

export const addMoreData = async (req, res, nex) => {
    try {
        const { text } = req.body;
        const embedding = await getEmbedding(text);
        const id = uuidv4()
        console.log("📐 Embedding length:", embedding.length);
        // const id="extra-data"/
        await upsertToQdrant(id.toString(), embedding, text);
        console.log(`✅ Synced  to Qdrant → ID: ${id}`);
    } catch (err) {
        console.error("❌ Error processing doc:", err.message);
    }

}