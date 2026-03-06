import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (action === "analyze") {
      const systemPrompt = `You are a cybersecurity AI analyst for VigilantAI, a behavioral threat detection platform. 
      
Analyze the following simulated user activity data and provide a threat assessment. Return a JSON response using the suggest_threat_assessment tool.

Consider these factors:
- Failed login attempts frequency
- Login time patterns (off-hours activity)
- Geographic anomalies (impossible travel)
- Device/browser changes
- IP address reputation patterns

Simulated activity summary:
- 150 total login attempts in the last 7 days
- 23 failed attempts (15% failure rate)
- 5 logins from new locations
- 3 logins at unusual hours (2-5 AM)
- 2 new devices detected
- 1 potential impossible travel event (NY to London in 2 hours)`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze the current security posture and provide a detailed threat assessment." },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_threat_assessment",
                description: "Return a structured threat assessment with risk score, anomaly label, explanation, recommendations, and risk factors.",
                parameters: {
                  type: "object",
                  properties: {
                    risk_score: { type: "number", description: "Risk score from 0-100" },
                    anomaly_label: { type: "string", enum: ["normal", "suspicious", "high_risk"], description: "Overall anomaly classification" },
                    explanation: { type: "string", description: "Detailed explanation of the threat assessment" },
                    recommendations: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of actionable security recommendations",
                    },
                    factors: {
                      type: "object",
                      properties: {
                        failed_logins: { type: "number" },
                        unusual_locations: { type: "number" },
                        off_hours_activity: { type: "number" },
                        new_devices: { type: "number" },
                        impossible_travel: { type: "number" },
                      },
                      required: ["failed_logins", "unusual_locations", "off_hours_activity", "new_devices", "impossible_travel"],
                      additionalProperties: false,
                    },
                  },
                  required: ["risk_score", "anomaly_label", "explanation", "recommendations", "factors"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "suggest_threat_assessment" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const text = await response.text();
        console.error("AI gateway error:", response.status, text);
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const result = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error("Unexpected AI response format");
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Edge function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
