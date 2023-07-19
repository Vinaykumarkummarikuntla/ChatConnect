/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
async function saveToDb(event) {
  event.preventDefault();
  const msg = document.getElementById('message').value;
  console.log('msg', msg);
  const obj = {msg};
  const token = localStorage.getItem('token');
  console.log(token);

  try {
    const response = await axios.post(
        'http://localhost:3000/chatdetails',
        obj,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);
    console.log(response.data, 'FULLDATA');
    console.log(response.data.chatdetails.message, 'MESSAGE');
    console.log(response.status, 'STATUS');
    // showMessages(response.data.chatdetails.message);
  } catch (err) {
    console.log(err);
  }
}


async function groupMessagesToDb(event) {
  event.preventDefault();
  const msg = document.getElementById('message').value;
  console.log('msg', msg);
  const obj = {msg};
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
        'http://localhost:3000/chatdetails',
        obj,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const existingMessages = [];

  async function getMessages() {
    try {
      const response = await axios.get('http://localhost:3000/chatdetails', {
        headers: {Authorization: token},
      });
      console.log('GET ALL MESSAGES', response);

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


// function showMessages(msg) {
//   console.log("showMessages function called");
//   const parentElement = document.getElementById("msg-bubble");
//   childHTML = `<div class="msg-text">
//   ${msg}
// </div>`
//   // childHTML = `<tr id =  ${msg}> <td>${msg} </td> </tr>`;
//   parentElement.innerHTML = parentElement.innerHTML + childHTML;
// }

let msgCounter = 0; // Counter variable for generating unique IDs

function showMessages(username, msg, timestamp) {
  console.log('showMessages function called');

  // Generate a unique ID for the message
  const msgId = `msg-${msgCounter}`;
  msgCounter++;

  // Create the message element
  const msgElement = document.createElement('div');
  msgElement.className = 'msg-bubble';
  msgElement.id = msgId;

  // Create the message info element
  const msgInfoElement = document.createElement('div');
  msgInfoElement.className = 'msg-info';

  // Create the username element
  const usernameElement = document.createElement('div');
  usernameElement.className = 'msg-info-name';
  usernameElement.textContent = username;

  // Create the timestamp element
  const timestampElement = document.createElement('div');
  timestampElement.className = 'msg-info-time';
  timestampElement.textContent = timestamp;

  // Append the username and timestamp elements to the message info element
  msgInfoElement.appendChild(usernameElement);
  msgInfoElement.appendChild(timestampElement);

  // Create the message text element
  const msgTextElement = document.createElement('div');
  msgTextElement.className = 'msg-text';
  msgTextElement.textContent = msg;

  // Append the message info and text elements to the message element
  msgElement.appendChild(msgInfoElement);
  msgElement.appendChild(msgTextElement);

  // Append the message element to the chat container
  const chatContainer = document.getElementById('msger-chat');
  chatContainer.appendChild(msgElement);
}


async function saveToGroupDB(event) {
  event.preventDefault();
  const groupname = document.getElementById('group-name-input').value;
  console.log('grpname', groupname);
  const obj = {groupname};
  const token = localStorage.getItem('token');
  console.log(token);

  try {
    const response = await axios.post(
        'http://localhost:3000/creategroup',
        obj,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);
    const group = response.data.groupdetails.group_name;
    const groupId = response.data.groupdetails.group_id;
    console.log(group, groupId, 'GROUP');
    showGroupName(group, groupId);
  } catch (err) {
    console.log(err);
  }
}

function showGroupName(group, groupId) {
  console.log('showgrounname function called', group);
  const parentElement = document.getElementsByClassName('group-list')[0];
  // console.log(parentElement);
  childHTML = `
  <li class="group-item">
    // eslint-disable-next-line max-len
    <a href="#" class="group-name" onclick="groupChatMessages(${groupId})" >${group}></a>
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

  // Retrieve stored group IDs from local storage
  const storedGroupIds = localStorage.getItem('groupIds');
  const groupIds = storedGroupIds ? JSON.parse(storedGroupIds) : [];

  // Add the new group ID to the array
  groupIds.push(groupId);

  // Save the updated group IDs back to local storage
  localStorage.setItem('groupIds', JSON.stringify(groupIds));
}
// onclick="groupChatMessages(${groupId})

function showOptions(groupId) {
  const dialog = document.getElementById('optionsDialog');
  dialog.showModal();
}

function closeOptionsDialog() {
  const dialog = document.getElementById('optionsDialog');
  dialog.close();
}


function Options(usernames, userid) {
  console.log('option function called');
  const optionsSection = document.getElementById('optionsSection');
  const usernameInput = document.getElementById('userbutton');
  const username = localStorage.getItem('username');
  console.log('Stored Username:', username );

  if (username) {
    const userList = document.getElementById('userList');
    console.log('userlist', userList);
    const listItem = document.createElement('li');
    listItem.textContent = username;

    const makeAdminButton = document.createElement('button');
    makeAdminButton.textContent = 'Make Admin';
    makeAdminButton.addEventListener('click', () => makeAdmin(username));
    console.log(makeAdminButton);

    const deleteUserButton = document.createElement('button');
    deleteUserButton.textContent = 'Delete User';
    deleteUserButton.addEventListener('click', () => deleteUser(username));

    listItem.appendChild(makeAdminButton);
    listItem.appendChild(deleteUserButton);

    userList.appendChild(listItem);
  }

  // usernameInput.value = "";
  // showOptions();
}

async function groupChatMessages(groupId) {
  const token = localStorage.getItem('token');


  try {
    // const response = await axios.get(
    //   `http://localhost:3000/groupchatdetails?groupid=${groupId}`,
    //   {
    //     headers: { Authorization: token },
    //   }
    // );
    // console.log(response);
    const msg1 = 'group message checking';
    const username = 'MOHAN';
    const time = 8;
    showMessages(username, msg1, time);
  } catch (err) {
    console.log(err);
  }
}

async function searchUsers() {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();
  console.log('OR', searchQuery);

  if (searchQuery) {
    const searchResults = await performUserSearch(searchQuery);

    console.log(searchResults, '  user search return function');
    const searchResultsContainer = document.getElementById('usersearchResults');
    searchResultsContainer.innerHTML = ''; // Clear previous search results

    searchResults.forEach((user) => {
      const userElement = document.createElement('div');
      console.log('NOT no Found', user.id, user.username);
      userElement.textContent = user.username;
      userElement.onclick = () => addUsernameToScreen(user.username, user.id);
      searchResultsContainer.appendChild(userElement);
      console.log(`Username: ${user.username}`);
      console.log(`ID: ${user.id}`);
    });


    //  if (users.username && users.id === 'undefined') {
    //   const noResultsMessage = document.createElement("p");
    //     noResultsMessage.textContent = "No users found.";
    //     searchResultsContainer.appendChild(noResultsMessage);
    // }

    searchInput.value = '';
  }
}

function addUsernameToScreen(username, userId) {
  const parentElement = document.getElementsByClassName('group-list')[0];

  childHTML = `
    <li class="group-item">
      <a href="#" class="group-name" onclick="UserChatMessages(${userId})">${username}</a>
    </li>
  `;

  const storedUsernames = localStorage.getItem('usernames');
  const usernames = storedUsernames ? JSON.parse(storedUsernames) : [];
  usernames.push(username);
  localStorage.setItem('usernames', JSON.stringify(usernames));
  parentElement.innerHTML += childHTML;
}

window.addEventListener('DOMContentLoaded', () => {
  const storedUsernames = localStorage.getItem('usernames');
  const usernames = storedUsernames ? JSON.parse(storedUsernames) : [];

  const parentElement = document.getElementsByClassName('group-list')[0];

  usernames.forEach((username) => {
    const childHTML = `
      <li class="group-item">
        <a href="#" class="group-name">${username}</a>
      </li>
    `;
    parentElement.innerHTML += childHTML;
  });
});


window.addEventListener('DOMContentLoaded', async () => {
  await loadGroupNames();
});

async function loadGroupNames() {
  // Retrieve and display group names
  const groupNames = await getGroupNames();
  console.log('%%%%%%%%%%%%%%%%%%%%', groupNames);
  const parentElement = document.getElementsByClassName('group-list')[0];

  groupNames.forEach((group) => {
    console.log(group.groupId, group.groupName ,"Checking gttting gropnaem and id ")
    const childHTML = `
      <li class="group-item">
        <a href="#" class="group-name" onclick="groupChatMessages(${group.groupId})">${group.groupName}</a>
        <button class="dropbtn" onclick="showOptions(${group.groupId})">options</button>
        <dialog id="optionsDialog">
          <a href="#" onclick="deleteGroup(${group.groupId})">Delete Group</a>
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
  });
};


async function searchUsers2() {
  const searchInput = document.getElementById('searchInput2');

  const searchQuery = searchInput2.value.trim();
  console.log('OR', searchQuery);

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
    const {username, id} = await performUserSearch(searchQuery);
    console.log(username, id, 'return function');
    const searchResultsContainer = document.getElementById('searchResults');

    // Loop through the search results and create clickable elements

    const resultElement = document.createElement('div');

    resultElement.textContent = username;
    resultElement.onclick = () => {
      Options(username, id);
      searchResultsContainer.innerHTML = ''; // Clear the search results from the screen
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
  const token = localStorage.getItem('token');

  console.log(searchQuery, 'Search Query');
  let searchResponse = [];
  try {
    const response = await axios.get(
        `http://localhost:3000/userSearch?username=${searchQuery}`,
        {
          headers: {Authorization: token},
        },
    );
    console.log('userserach return response --->', response.data.usersearchdetails);
    searchResponse = response.data.usersearchdetails;
    response.data.usersearchdetails.forEach((user) => {
      console.log(`Username: ${user.username}`);
      console.log(`ID: ${user.id}`);
    });
  } catch (err) {
    console.log(err);
  }

  return searchResponse;
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


async function getGroupNames() {
  const token = localStorage.getItem('token');
  let groupResponse = [];
  try {
    const response = await axios.get(
        'http://localhost:3000/getgroupnames',
        {
          headers: {Authorization: token},
        },
    );
    groupResponse = response.data.groupDetails;
    console.log(response.data, 'GROUPDETAILSAPIDATA');
  } catch (err) {
    console.log(err);
  }
  return groupResponse;
}
