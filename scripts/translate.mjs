import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const sourceLang = 'zh';
const sourcePath = path.join(process.cwd(), 'src/shared/locales', `${sourceLang}.json`);
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

const targetLangs = ['en'];

async function translate(text, targetLang) {
  try {
    const prompt = `You are a professional translator. Translate the following text into ${targetLang}. Only return the translated text. Do not add any explanation or quotes. Text: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return text;
  }
}

async function syncLocale(targetLang) {
  const targetPath = path.join(process.cwd(), 'src/shared/locales', `${targetLang}.json`);
  let targetData = {};
  if (fs.existsSync(targetPath)) {
    targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  }

  async function deepTranslate(source, target) {
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) target[key] = {};
        await deepTranslate(source[key], target[key]);
      } else {
        if (!target[key]) {
          console.log(`Translating key: ${key} to ${targetLang}...`);
          target[key] = await translate(source[key], targetLang);
        }
      }
    }
  }

  await deepTranslate(sourceData, targetData);
  fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n');
  console.log(`Updated ${targetLang}.json`);
}

(async () => {
  console.log("Starting translation sync...");
  for (const lang of targetLangs) {
    await syncLocale(lang);
  }
  console.log("All translations updated successfully.");
})();
