Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, content, upvotes, comments } = await req.json();

    const commentsText = (comments || [])
      .map((comment: { text?: string }) => comment.text)
      .filter(Boolean)
      .join("\n");

    const prompt = `
Summarize this fishing forum post in 2-3 friendly sentences.

Title: ${title}
Description: ${content || "No description"}
Upvotes: ${upvotes || 0}
Comments:
${commentsText || "No comments"}

Include:
- Main topic
- Overall reaction
- Helpful takeaway
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const data = await openaiRes.json();

    console.log("OpenAI response:", JSON.stringify(data));

    const summary =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.[0]?.content?.[0]?.value ||
      data.error?.message ||
      "No summary generated.";

    return new Response(JSON.stringify({ summary }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Function error:", error);

    return new Response(
      JSON.stringify({
        summary: "Something went wrong while generating the summary.",
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});