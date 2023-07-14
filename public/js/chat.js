async function saveToDb(event) {
  event.preventDefault();
  const msg = document.getElementById("message").value;
  console.log("msg", msg);
  const obj = { msg };
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const response = await axios.post(
      "http://localhost:3000/chatdetails",
      obj,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
    console.log(response.data, "FULLDATA");
    console.log(response.data.chatdetails.message, "MESSAGE");
    console.log(response.status, "STATUS");
    showMessages(response.data.chatdetails.message);
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  async function getmessages() {
    console.log("function called");
    try {
      const response = await axios.get("http://localhost:3000/chatdetails", {
        headers: { Authorization: token },
      });
      console.log("GET ALL MESSAGES ", response);

      const messages = response.data.chatdetails;

      if (Array.isArray(messages)) {
        // Iterate over each message in the array
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i].message;

          showMessages(message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  getmessages();
});

function showMessages(msg) {
  console.log("showMessages function called");

  const parentElement = document.getElementById("chattable");
  childHTML = `<tr id =  ${msg}> <td>${msg} </td> </tr>`;
  parentElement.innerHTML = parentElement.innerHTML + childHTML;
}
