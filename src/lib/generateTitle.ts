'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
);

export async function generateTitle() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Give me a unordered list of spooky Halloween event titles using this JSON schema:

  HalloweenTitle = {'title': string}
  Return: Array<HalloweenTitle>`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonFromString(text);
}

function parseJsonFromString(text: string): any {
  // Extract the JSON content between the ```json and ``` markers
  const jsonString = text.match(/```json\s*\n([\s\S]*?)\n```/);

  // If a match is found, parse the JSON content
  if (jsonString && jsonString[1]) {
    try {
      return JSON.parse(jsonString[1]);
    } catch (error) {
      console.error('Failed to parse JSON', error);
      return null;
    }
  }

  // Return null if no matching content is found
  return null;
}
