"use server";
import clientPromise from "./mongodb";

export async function storeLogs(collection, data) {
	const client = await clientPromise;
	const db = client.db("tuacar");

	await db
		.collection(collection)
		.insertOne(data)
}