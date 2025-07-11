"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import axios from "axios";
// import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
// import { googleGemini } from "@/gemini";


const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY!;
const AZURE_OPENAI_ENDPOINT = "https://sadan-mcygibeu-eastus2.openai.azure.com/";
const AZURE_DEPLOYMENT_NAME = "gpt-4.1-mini";
const API_VERSION = "2024-02-15-preview";

interface AzureError {
  response?: {
    data?: {
      error?: {
        message?: string;
        code?: string;
      };
    };
  };
}


export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      }
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error);
  }
}

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error);
  }
}
export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error);
  }
}

function isAzureError(error: unknown): error is AzureError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as AzureError).response?.data?.error?.message === "string"
  );
}


export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
        You are a helpful assistant that answers questions about a user's notes. 
        Assume all questions are related to the user's notes. 
        Make sure that your answers are not too verbose and you speak succinctly. 
        Your responses MUST be formatted in clean, valid HTML with proper structure. 
        Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
        Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
        Avoid inline styles, JavaScript, or custom attributes.

        Rendered like this in JSX:
        <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

        Here are the user's notes:
        ${formattedNotes}
      `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }

  let completion;
  try {
    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`,
      {
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "api-key": AZURE_OPENAI_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    completion = response.data;
  } catch (error: unknown) {
    if (isAzureError(error)) {
      const message = error.response?.data?.error?.message?.toLowerCase();
      const code = error.response?.data?.error?.code;

      if (
        message?.includes("insufficient quota") ||
        code === "insufficient_quota"
      ) {
        console.error("Azure OpenAI quota exceeded:", error);
        return "AI service is currently unavailable due to quota limits.";
      }

      console.error("Azure OpenAI error:", error.response?.data);
    } else if (error instanceof Error) {
      console.error("Unknown error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }

  return completion.choices?.[0]?.message?.content || "A problem has occurred";
};


// export const askGeminiAboutNotesAction = async (
//   newQuestions: string[],
//   responses: string[],
// ) => {
//   const user = await getUser();
//   if (!user) throw new Error("You must be logged in to ask AI questions");

//   const notes = await prisma.note.findMany({
//     where: { authorId: user.id },
//     orderBy: { createdAt: "desc" },
//     select: { text: true, createdAt: true, updatedAt: true },
//   });

//   if (notes.length === 0) {
//     return "You don't have any notes yet.";
//   }

//   const formattedNotes = (notes as Note[])
//     .map((note) =>
//       `
//       Text: ${note.text}
//       Created at: ${note.createdAt}
//       Last updated: ${note.updatedAt}
//       `.trim(),
//     )
//     .join("\n");

//   // Compose the prompt for Gemini
//   let prompt = `
// You are a helpful assistant that answers questions about a user's notes.
// Assume all questions are related to the user's notes.
// Make sure that your answers are not too verbose and you speak succinctly.
// Your responses MUST be formatted in clean, valid HTML with proper structure.
// Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate.
// Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph.
// Avoid inline styles, JavaScript, or custom attributes.

// Rendered like this in JSX:
// <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

// Here are the user's notes:
// ${formattedNotes}
// `;

//   for (let i = 0; i < newQuestions.length; i++) {
//     prompt += `\nUser: ${newQuestions[i]}`;
//     if (responses.length > i) {
//       prompt += `\nAssistant: ${responses[i]}`;
//     }
//   }

//   // Call Gemini API (assuming googleGemini.generateContent returns { response: string })
//   const geminiResponse = await googleGemini.generateContent(prompt);

//   return geminiResponse?.response || "A problem has occurred";
// };