export const ChatAPI = {
  sendMessage: async function (msg) {
    try {
      const response = await fetch(`http://localhost:5000/message`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({message: msg})
      });

      if (!response.ok) {
          throw new Error("Error sending message:", response.status);
      } else {
          const responseData = await response.json();
          return responseData;
      }
    } catch (error) {
      throw new Error("Error sending message:", error);
    }
  }
}