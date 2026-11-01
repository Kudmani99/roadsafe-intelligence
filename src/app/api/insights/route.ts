import { NextResponse } from "next/server";
import { prisma, serializeReport } from "@/lib/db";
import {
  buildAIPrompt,
  generateLocalInsights,
} from "@/lib/analytics";
import type { AIAction, AIInsight } from "@/lib/types";

async function callOpenAI(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a GTA road safety analyst. Respond with valid JSON only, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
}

async function callGroq(prompt: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a GTA road safety analyst. Respond with valid JSON only, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
}

function parseAIResponse(raw: string): {
  insights: AIInsight[];
  actions: AIAction[];
  summary: string;
} | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.insights || !parsed.actions) return null;
    return {
      insights: parsed.insights,
      actions: parsed.actions,
      summary: parsed.summary || "",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = reports.map(serializeReport);
  const prompt = buildAIPrompt(serialized);

  let poweredBy: "openai" | "groq" | "local" = "local";
  let result = null;

  const openaiRaw = await callOpenAI(prompt);
  if (openaiRaw) {
    result = parseAIResponse(openaiRaw);
    if (result) poweredBy = "openai";
  }

  if (!result) {
    const groqRaw = await callGroq(prompt);
    if (groqRaw) {
      result = parseAIResponse(groqRaw);
      if (result) poweredBy = "groq";
    }
  }

  if (!result) {
    result = generateLocalInsights(serialized);
  }

  return NextResponse.json({
    ...result,
    poweredBy,
    reportCount: reports.length,
  });
}
