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
    const group = response.data.groupdetails.group_name;
    const groupId = response.data.groupdetails.group_id;
    console.log(group, groupId, "GROUP");
    showGroupName(group, groupId);
  } catch (err) {
    console.log(err);
  }
}

function showGroupName(group, groupId) {
  console.log("showgrounname function called", group);
  const parentElement = document.getElementsByClassName("group-list")[0];
  console.log(parentElement);
  childHTML = `
  <li class="group-item">
    <a href="#" class="group-name" onclick="groupChatMessages(${groupId})">${group}></a>
    <button class="dropbtn" onclick="showOptions(${groupId})">options</button>
    <dialog id="optionsDialog">
    <a href="#" onclick="deleteGroup(${groupId})">Delete Group</a>
    <div id="optionsSection">
    <h4>Users:</h4>
    <ul id="userList"></ul>
    </div>
    <input type="text" id="searchInput2" placeholder="Search User">
      <button onclick="searchUsers2()">Search</button>
      <div id="searchResults"></div>
    <button onclick="closeOptionsDialog()">Close</button>
  </dialog>
</li>
`;

  parentElement.innerHTML += childHTML;
}
// onclick="groupChatMessages(${groupId})

function showOptions(groupId) {
  const dialog = document.getElementById("optionsDialog");
  dialog.showModal();
}

function closeOptionsDialog() {
  const dialog = document.getElementById("optionsDialog");
  dialog.close();
}



function Options(usernames,userid) {
  console.log("option function called");
  const optionsSection = document.getElementById("optionsSection");
  const usernameInput = document.getElementById("userbutton");
  const username = localStorage.getItem("username");
  console.log("Stored Username:", username );

  if (username) {
    const userList = document.getElementById("userList");
    console.log("userlist", userList);
    const listItem = document.createElement("li");
    listItem.textContent = username;

    const makeAdminButton = document.createElement("button");
    makeAdminButton.textContent = "Make Admin";
    makeAdminButton.addEventListener("click", () => makeAdmin(username));
    console.log(makeAdminButton);

    const deleteUserButton = document.createElement("button");
    deleteUserButton.textContent = "Delete User";
    deleteUserButton.addEventListener("click", () => deleteUser(username));

    listItem.appendChild(makeAdminButton);
    listItem.appendChild(deleteUserButton);

    userList.appendChild(listItem);
  }

  // usernameInput.value = "";
  // showOptions();
}

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
    const msg1 = "groupmessage print purpose";
    showMessages(msg1);
  } catch (err) {
    console.log(err);
  }
}

function searchUsers() {
  const searchInput = document.getElementById("searchInput");
  console.log();
  const searchQuery = searchInput.value.trim();
  console.log("OR", searchQuery);

  if (searchQuery) {
    const searchResults = performUserSearch(searchQuery);
    console.log(searchResults, "return function");
    const searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = ""; // Clear previous search results

    if (searchResults.length > 0) {
      for (const user of searchResults) {
        const userElement = document.createElement("div");
        userElement.textContent = user.username;
        searchResultsContainer.appendChild(userElement);
      }
    } else {
      // Display a message when no search results found
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "No users found.";
      searchResultsContainer.appendChild(noResultsMessage);
    }
  }

  searchInput.value = "";
}

async function searchUsers2() {
  const searchInput = document.getElementById("searchInput2");

  const searchQuery = searchInput2.value.trim();
  console.log("OR", searchQuery);

  // if (searchQuery) {
  //   const searchResults = await performUserSearch(searchQuery);
  //   console.log(searchResults,"return function")
  //   // const searchResultsContainer = document.getElementById("userbutton");
  //   // // searchResultsContainer.innerHTML = ""; // Clear previous search results
  //   if (searchResults.length > 0) {
  //     const userButton = document.getElementById("userbutton");
  //     console.log(searchResults,"USERNAMEING ADDING")
  //     userButton.textContent = searchResults;
  //     console.log(userButton)// Update the button text with the first search result
  //   }
  // }
  if (searchQuery) {
    const {username,id} = await performUserSearch(searchQuery);
    console.log(username,id, "return function");
    const searchResultsContainer = document.getElementById("searchResults");

    // Loop through the search results and create clickable elements

  const resultElement = document.createElement("div");
  
  resultElement.textContent = username;
  resultElement.onclick = () => {
    Options(username , id);
    searchResultsContainer.innerHTML = ""; // Clear the search results from the screen
  };
  searchResultsContainer.appendChild(resultElement);



}


    // if (searchResults) {
    //   const userButton = document.getElementById("userbutton");
    //   console.log(searchResults, "USERNAMEING ADDING");
    //   userButton.textContent = searchResults;
    //   console.log(userButton); // Update the button text with the search result
    // }
  }










async function performUserSearch(searchQuery) {
  const token = localStorage.getItem("token");

  console.log(searchQuery, "Search Query");
  try {
    const response = await axios.get(
      `http://localhost:3000/userSearch?username=${searchQuery}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log("userserach --->", response.data.usersearchdetails.username);
    var username = response.data.usersearchdetails.username;
    var id = response.data.usersearchdetails.id;
  } catch (err) {
    console.log(err);
  }
  console.log("at the time of return function", username, id);
  // Storing values in localStorage
// localStorage.setItem("username", username);
// localStorage.setItem("id", id);

// // Retrieving values from localStorage
// const storedUsername = localStorage.getItem("username");
// const storedId = localStorage.getItem("id");

// console.log("Stored Username:", storedUsername);
// console.log("Stored ID:", storedId);



  return {username,id};
}

// Function to fetch user data from the server
// async function getUsers() {
//   try {
//     const token = localStorage.getItem("token")
//     const response = await axios.get("http://localhost:3000/users",
//     {
//       headers: { Authorization: token },
//     });
//     console.log("USERS",response.data)
//     const users = response.data.userDetails

//     // Get the dropdown element
//     const userDropdown = document.getElementById("userDropdown");

//     // Loop through the users and create an option element for each user
//     users.forEach(user => {
//       const option = document.createElement("option");
//       option.value = user.id; // Use a unique identifier for the user (e.g., user ID)
//       option.text = user.username; // Display the username in the dropdown option
//       userDropdown.appendChild(option);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Call the getUsers function to populate the dropdown on page load
// window.addEventListener("DOMContentLoaded", getUsers);
