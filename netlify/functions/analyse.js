exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "success",
      message: "SatyaSetu AI server is running!"
    })
  };
};