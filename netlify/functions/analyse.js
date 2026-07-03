exports.handler = async (event) => {
  // CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const { complaint } = JSON.parse(event.body);

    if (!complaint || complaint.trim() === "") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Complaint text is required."
        })
      };
    }

    const prompt = `
You are an AI used in an Indian public grievance platform called SatyaSetu.

Analyze the complaint carefully.

Tasks:
1. Detect whether the complaint is spam, fake, abusive, meaningless, or gibberish.
2. If genuine, classify severity as:
   - Low
   - High
   - Severe
3. Assign the most appropriate government department.
4. Give a priority score from 1-100.
5. Give a confidence score from 0-100.
6. Give a short reason (maximum 25 words).

Return ONLY valid JSON.

Example:

{
  "spam": false,
  "severity": "High",
  "priority": 82,
  "department": "Public Works Department",
  "confidence": 96,
  "reason": "Large pothole causing danger to commuters."
}

Complaint:

${complaint}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-12b-it:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(data)
      };
    }

    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: reply
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
