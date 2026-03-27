import { GoogleGenAI } from "@google/genai";
import { Subscription } from "../types";
import { EXCHANGE_RATES, CURRENCY_SYMBOLS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSpendingInsights(subscriptions: Subscription[]): Promise<string> {
  if (subscriptions.length === 0) {
    return "Add some subscriptions to get AI-powered insights on your spending!";
  }

  const totalMonthlyGBP = subscriptions.reduce((acc, sub) => {
    const rate = EXCHANGE_RATES[sub.currency] || 1;
    const amountInGBP = sub.amount * rate;
    const monthlyAmount = sub.billingCycle === 'yearly' ? amountInGBP / 12 : amountInGBP;
    return acc + monthlyAmount;
  }, 0);

  const subDetails = subscriptions.map(s => 
    `- ${s.name}: ${CURRENCY_SYMBOLS[s.currency] || s.currency}${s.amount} (${s.billingCycle}) - ${s.category}`
  ).join('\n');

  const prompt = `
    As a financial advisor AI, analyze the following subscription list and provide 3-4 concise, actionable insights.
    Total Monthly Spending (converted to GBP): £${totalMonthlyGBP.toFixed(2)}
    
    Subscriptions:
    ${subDetails}

    Focus on:
    1. Identifying potential overlaps (e.g., multiple streaming services).
    2. Suggesting yearly vs monthly optimizations.
    3. Highlighting high-cost categories.
    4. General budgeting advice based on the total.

    Format the response as a clean list of insights with a title and a short description for each. Use markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Error connecting to AI service. Please try again later.";
  }
}
