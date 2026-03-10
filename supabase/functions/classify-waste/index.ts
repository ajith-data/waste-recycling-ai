import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Extract the base64 data from the data URL
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const mimeMatch = imageBase64.match(/data:(image\/[^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const models = ["google/gemini-2.5-flash", "google/gemini-2.5-flash-lite", "openai/gpt-5-mini"];
    
    const requestBody = (model: string) => JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `You are a waste classification AI expert. Analyze the image and classify it into one of these categories: Plastic, Paper, Glass, Metal, Organic, E-Waste, Hazardous.

You MUST respond by calling the classify_waste function with your analysis.`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Data}` }
            },
            {
              type: "text",
              text: "Classify this waste item. Identify the type, provide recycling guidance, environmental impact, and sustainability tips."
            }
          ]
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "classify_waste",
            description: "Return waste classification results",
            parameters: {
              type: "object",
              properties: {
                predicted_class: { type: "string", enum: ["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste", "Hazardous"] },
                confidence_score: { type: "number", description: "Confidence percentage 0-100" },
                recycling_bin: { type: "string", description: "Which bin to put it in, e.g. Blue Recycling Bin" },
                environmental_impact: { type: "string", description: "Brief environmental impact statement" },
                sustainability_tips: { type: "array", items: { type: "string" }, description: "3-5 sustainability tips" },
                explanation: { type: "string", description: "Detailed educational explanation of why this belongs to the category, how to recycle it, and sustainable alternatives. 2-3 paragraphs." }
              },
              required: ["predicted_class", "confidence_score", "recycling_bin", "environmental_impact", "sustainability_tips", "explanation"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "classify_waste" } }
    });

    let response: Response | null = null;
    let lastError = "";

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`Trying model: ${model}, attempt: ${attempt + 1}`);
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: requestBody(model),
          });

          if (res.ok) {
            response = res;
            break;
          }

          if (res.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
              status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          if (res.status === 402) {
            return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits." }), {
              status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          const text = await res.text();
          lastError = `${res.status}: ${text}`;
          console.error(`Model ${model} attempt ${attempt + 1} failed:`, lastError);
          
          // Wait before retry (503 = temporary)
          if (res.status === 503 && attempt === 0) {
            await new Promise(r => setTimeout(r, 2000));
          }
        } catch (fetchErr) {
          lastError = String(fetchErr);
          console.error(`Fetch error for ${model}:`, lastError);
        }
      }
      if (response) break;
    }

    if (!response) {
      console.error("All models failed. Last error:", lastError);
      throw new Error("AI classification temporarily unavailable. Please try again.");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("AI did not return classification results");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-waste error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
