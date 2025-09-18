const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const providerErrorFallback =
  "I'm having trouble retrieving species information right now. Please try again in a moment.";

const systemPrompt = `You are a friendly expert on animal species answering questions in English.
- Stick strictly to topics involving animals, species, habitats, diets, conservation status, behaviours, taxonomy, and related zoological facts.
- When users ask about something that is not related to animal species, reply with a brief apology followed by a reminder that you only answer species-related questions.
- Keep responses concise, factual, and easy to understand. Use Markdown for light formatting when it improves clarity.`;

const apiKey = process.env.OPENAI_API_KEY;

// type that keeps choices, message, and content as optional in case API returns odd results
type OpenAIChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string | null;
    } | null;
  }>;
};

// wraps user message with system prompt
function buildRequestBody(userMessage: string) {
  return JSON.stringify({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.4, // responses stay moderate
  });
}

async function callOpenAI(userMessage: string) {
  if (!apiKey) {
    return providerErrorFallback;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST", // packages and sends the message to API server
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: buildRequestBody(userMessage),
    });

    if (!response.ok) {
      return providerErrorFallback;
    }

    const data = (await response.json()) as OpenAIChatCompletion;
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return providerErrorFallback;
    }

    return content;
  } catch (error) {
    return providerErrorFallback;
  }
}

export const SPECIES_CHAT_FALLBACK_RESPONSE = providerErrorFallback;

export async function generateResponse(message: string): Promise<string> {
  return callOpenAI(message.trim());
}
