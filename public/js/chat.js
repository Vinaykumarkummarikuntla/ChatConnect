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
    // showMessages(response.data.chatdetails.message);
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  let existingMessages = [];

  async function getMessages() {
    try {
      const response = await axios.get("http://localhost:3000/chatdetails", {
        headers: { Authorization: token },
      });
      console.log("GET ALL MESSAGES", response);

      const messages = response.data.chatdetails;

      if (Array.isArray(messages)) {
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (!existingMessages.includes(message.message)) {
            showMessages(message.message);
            existingMessages.push(message.message);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Call the getMessages() function initially
  getMessages();

  // Call the getMessages() function every 1 second
  // setInterval(getMessages, 1000);
});




function showMessages(msg) {
  console.log("showMessages function called");
  const parentElement = document.getElementById("chattable");
  childHTML = `<tr id =  ${msg}> <td>${msg} </td> </tr>`;
  parentElement.innerHTML = parentElement.innerHTML + childHTML;
}





async function saveToGroupDB(event) {
  event.preventDefault();
  const groupname = document.getElementById("group-name-input").value;
  console.log("grpname", groupname);
  const obj = { groupname };
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const response = await axios.post(
      "http://localhost:3000/creategroup",
      obj,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
    const group = response.data.groupdetails.group_name
    const groupId = response.data.groupdetails.group_id
    console.log(group,groupId,"GROUP")
    showGroupName(group,groupId)
    
  } catch (err) {
    console.log(err);
  }
}

function showGroupName(group,groupId){
  console.log("showgrounname function called", group);
  const parentElement = document.getElementsByClassName("group-list")[0];
  console.log(parentElement)
  childHTML = `<li class="group-item">
  <a href="#" class="active" onclick="groupChatMessages(${groupId})">${group}</a>
  </li>`;
  parentElement.innerHTML = parentElement.innerHTML + childHTML;

}
// onclick="groupChatMessages(${groupId})

async function groupChatMessages(groupId) {
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const response = await axios.get(
      `http://localhost:3000/groupchatdetails?groupid=${groupId}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
    const msg1 = "groupmessage print purpose"
    showMessages(msg1)
  } catch (err) {
    console.log(err);
  }
}