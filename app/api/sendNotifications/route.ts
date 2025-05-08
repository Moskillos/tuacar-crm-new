import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import serviceAccount from "@/serviceAccountKey.json"; // percorso corretto

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_PRIVATE_KEY,
        privateKey: process.env.FIREBASE_CLIENT_EMAIL,   
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, title, body } = req.body;

  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Errore invio notifica:", error);
    res.status(500).json({ success: false, error });
  }
}