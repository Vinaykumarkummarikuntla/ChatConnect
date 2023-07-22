/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// const socket = io()
const JWT_TOKEN = localStorage.getItem('token');

console.log(JWT_TOKEN);
const socket = io('http://localhost:3000', {
  query: {token: JWT_TOKEN},
});
let selectedGroup = null;
let selectedUser = null;
let groupSelectedInformation = null;

// TODO PERSONAL MESSSAGES STORING
// async function personalMessagesToDb(event) {
//   event.preventDefault();
//   const msg = document.getElementById('message').value;
//   const userId = selectedUser;
//   console.log('msg', msg, userId);
//   const obj = {msg};
//   const token = localStorage.getItem('token');

//   try {
//     const response = await axios.post(
//         'http://localhost:3000/personalmsgs',
//         obj,
//         {
//           headers: {Authorization: token},
//         },
//     );
//     console.log(response.data, 'FULLDATA');
//     console.log(response.data.chatdetails.message, 'MESSAGE');
//   } catch (err) {
//     console.log(err);
//   }
// }

function formatTime(timestamp) {
  const options = {hour: 'numeric', minute: 'numeric', hour12: true};
  return new Date(timestamp).toLocaleTimeString(undefined, options);
}

async function personalMessagesToDb(event) {
  event.preventDefault();
  const msg = document.getElementById('message').value;
  const username = selectedUser;

  console.log('msg', msg, username);

  const timestamp = new Date().toISOString();
  const formattedTime = formatTime(timestamp);
  console.log(formattedTime);
  const chatDetails = {username, msg, formattedTime};

  socket.emit('send-chat-message', chatDetails);
}

socket.on('chat-message', (receivedMessages) => {
  console.log('receieved messgaes ', receivedMessages);

  for (const key in receivedMessages) {
    if (receivedMessages.hasOwnProperty(key)) {
      const message = receivedMessages[key];
      const {formattedTime, msg, username} = message;
      console.log(username, msg, formattedTime);
      // Call the showMessages function for each message separately
      showMessages(username, msg, formattedTime);
    }
  }
  // Display the received message in the console
  // Call a function to display the message in the frontend UI (You can use `showMessages` function here)
});

// TODO GROUP MESSSAGES STORING
async function groupMessagesToDb(event, selectedGroup) {
  event.preventDefault();
  const msg = document.getElementById('message').value;
  console.log('msg', msg);
  const obj = {msg, selectedGroup};
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

// TODO RETRIEVING MESSAGES SHOWING ON SCREEN UI CHAT
// window.addEventListener('DOMContentLoaded', () => {
//   const token = localStorage.getItem('token');
//   const existingMessages = [];

//   async function getMessages() {
//     try {
//       const response = await axios.get('http://localhost:3000/chatdetails', {
//         headers: {Authorization: token},
//       });
//       console.log('GET ALL MESSAGES', response);

//       const messages = response.data.chatdetails;

//       if (Array.isArray(messages)) {
//         for (let i = 0; i < messages.length; i++) {
//           const message = messages[i];
//           if (!existingMessages.includes(message.message)) {
//             showMessages(message.message);
//             existingMessages.push(message.message);
//           }
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // Call the getMessages() function initially
//   getMessages();

//   // Call the getMessages() function every 1 second
//   // setInterval(getMessages, 1000);
// });

// TODO MESSAGES ADDING TO CHAT UI
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

// TODO CREATE GROUP NAME
async function saveToGroupDB(event) {
  event.preventDefault();
  const groupname = document.getElementById('group-name-input').value;
  console.log('grpname', groupname);
  const obj = {groupname};
  const token = localStorage.getItem('token');

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

// TODO SHOWING GROUP NAME ON SCREEN WITH OPTION BUTTON
function showGroupName(group, groupId) {
  console.log('showgrounname function called', group);
  const parentElement = document.getElementsByClassName('group-list')[0];
  childHTML = `
  <li class="group-item">
    <a href="#" class="group-name" onclick="groupChatMessages(${groupId})">${group}<button class="dropbtn" onclick="showOptions(${groupId})">EDIT GROUP</button></a>
    <dialog id="optionsDialog">
    <a href="#"onclick="deleteGroup(this)">Delete Group</a>
    // <a href="#" onclick="deleteGroup('${groupId}', '${group}')">Delete Group</a>
    <div id="optionsSection">
    <h4>Users:</h4>
    <ul id="userList"></ul>
    </div>
    <input type="text" id="searchInput2" placeholder="Search User">
      <button onclick="searchUsers2()">Search</button>
      <div id="searchResults"></div>
    <button id="closebutton" onclick="closeOptionsDialog()">Close</button>
  </dialog>
</li>
`;

  parentElement.innerHTML += childHTML;

  // // Retrieve stored group IDs from local storage
  // const storedGroupIds = localStorage.getItem('groupIds');
  // const groupIds = storedGroupIds ? JSON.parse(storedGroupIds) : [];

  // // Add the new group ID to the array
  // groupIds.push(groupId);

  // // Save the updated group IDs back to local storage
  // localStorage.setItem('groupIds', JSON.stringify(groupIds));
}

// TODO DIALOG BOX OPEN
// function showOptions(groupId) {
//   console.log(groupId);
//   const dialog = document.getElementById('optionsDialog');

//   dialog.showModal();
// }
// TODO CLOSE DIALOG BOX
function closeOptionsDialog() {
  const dialog = document.getElementById('optionsDialog');
  dialog.close();
}

// TODO CREATING OPTIONS MAKE ADMIN AND DELETE USER
function Options(username, userid) {
  console.log('option function called');
  const optionsSection = document.getElementById('optionsSection');
  const usernameInput = document.getElementById('userbutton');

  if (username) {
    const userList = document.getElementById('userList');
    console.log('userlist', userList);
    const listItem = document.createElement('li');
    listItem.textContent = username;

    // const makeAdminButton = document.createElement('button');
    // makeAdminButton.textContent = 'Make Admin';
    // makeAdminButton.addEventListener('click', () => makeAdmin(username));
    // console.log(makeAdminButton);

    const deleteUserButton = document.createElement('button');
    deleteUserButton.textContent = 'Delete User';
    deleteUserButton.addEventListener('click', () => deleteUser(username));

    // listItem.appendChild(makeAdminButton);
    listItem.appendChild(deleteUserButton);

    userList.appendChild(listItem);
  }

  // usernameInput.value = "";
  // showOptions();
}


// TODO RETRIEVING GROUP CHAT MESSAGES
async function groupChatMessages(groupId) {
  const token = localStorage.getItem('token');
  console.log(groupId, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  selectedGroup = groupId;
  console.log('GROUP NAME SELECTED ()()()()()()()()()(()(()', selectedGroup);

  try {
    const response = await axios.get(
        `http://localhost:3000/groupchatdetails/${groupId}`,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response.data.groupDetails);
    const groupMembers = await response.data.groupMembers;
    groupSelectedInformation = await response.data.groupDetails;

    console.log(groupSelectedInformation, 'group response attached to variable');


    // Update the dialog content using the selectedGroup information
    const dialogContent = document.getElementById('optionsSection');
    dialogContent.innerHTML = `
    <h4>Group ID: ${groupSelectedInformation.group_id}</h4>
    <h4>Group Name: ${groupSelectedInformation.group_name}</h4>
    <a href="#" onclick="deleteGroup(${groupSelectedInformation.group_id})">Delete Group</a>
        <div id="optionsSection">
        <h4>Users:</h4>
        <ul id="userList"> </ul>

        </div>
        <input type="text" id="searchInput2" placeholder="Search User">
        <button onclick="searchUsers2()">Search</button>
        <div id="searchResults"></div>
        <button onclick="closeOptionsDialog()">Close</button>
    <!-- Add other dialog content here -->
  `;

    const deleteUserButton = document.createElement('button');
    deleteUserButton.textContent = 'Delete User';
    deleteUserButton.addEventListener('click', () => deleteUser(username, groupSelectedInformation.group_id));
    const userList = document.getElementById('userList');

    // Loop through the groupMembers array and add each username to the userList
    groupMembers.forEach((username) => {
      const listItem = document.createElement('li');
      listItem.textContent = username;

      const deleteUserButton = document.createElement('button');
      deleteUserButton.textContent = 'Delete User';
      deleteUserButton.addEventListener('click', () => deleteUser(username,groupSelectedInformation.group_id));
      const userList = document.getElementById('userList');
      userList.appendChild(listItem);
      userList.appendChild(deleteUserButton);
    });


    const msg1 = 'group message checking';
    const username = 'MOHAN';
    const time = 8;
    showMessages(username, msg1, time);
  } catch (err) {
    console.log(err);
  }
}

// TODO SEARCH USERS ON MAIN SCREEN
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

function handleUsernameClick(username) {
  setSelectedUser(username);
  UserChatMessages(username);
}

function setSelectedUser(username) {
  selectedUser = username;
  console.log('Connected to the server', selectedUser);
  // Join the room with the user's username
  socket.emit('join-room', selectedUser);
  console.log('SELECTED USER', selectedUser);
}

// TODO ADDING USERNAMES ON SCREEN
function addUsernameToScreen(username, userId) {
  const parentElement = document.getElementsByClassName('group-list')[0];

  childHTML = `
    <li class="group-item">
      <a href="#" class="group-name" onclick="handleUsernameClick('${username}')">${username}</a>
    </li>
  `;
  const storedUsernames = localStorage.getItem('usernames');
  const usernames = storedUsernames ? JSON.parse(storedUsernames) : [];
  usernames.push(username);
  localStorage.setItem('usernames', JSON.stringify(usernames));
  parentElement.innerHTML += childHTML;
}

// TODO PAGE REFRESH LOAD USER NAMES
window.addEventListener('DOMContentLoaded', () => {
  const storedUsernames = localStorage.getItem('usernames');
  const usernames = storedUsernames ? JSON.parse(storedUsernames) : [];

  const parentElement = document.getElementsByClassName('group-list')[0];

  usernames.forEach((username) => {
    const childHTML = `
      <li class="group-item">
        <a href="#" class="group-name" onclick="handleUsernameClick('${username}')>${username}</a>
      </li>
    `;
    parentElement.innerHTML += childHTML;

    console.log('USERNAMES PRINTING WHEN CLICK USERNAMES', `${username}`);
  });
});

// TODO PAGE REFRESH LOAD GROUP NAMES
window.addEventListener('DOMContentLoaded', async () => {
  createOptionsDialog();
  await loadGroupNames();
});

// TODO LOAD GROUP NAMES
async function loadGroupNames() {
  // Retrieve and display group names
  const groupNames = await getGroupNames();
  console.log('%%%%%%%%%%%%%%%%%%%%', groupNames);
  const parentElement = document.getElementsByClassName('group-list')[0];

  groupNames.forEach((group) => {
    console.log(
        group.groupId,
        group.groupName,
        'Checking getting correct group id and name ',
    );
    const childHTML = `
      <li class="group-item">
        <a href="#" class="group-name" onclick="groupChatMessages(${group.groupId})">${group.groupName}</a>
        <button class="dropbtn" onclick="optionsDialog(${group.groupId})">EDIT GROUP</button>
      </li>
    `;

    parentElement.innerHTML += childHTML;
  });
}
// <li class="group-item">
//   <a href="#" class="group-name" onclick="groupChatMessages(${group.groupId})">${group.groupName}
//   <button class="dropbtn" onclick="showOptions(${group.groupId})">EDIT GROUP</button></a>
//   <dialog id="optionsDialog">
//   <a href="#" onclick="deleteGroup(${group.groupId}, '${group.groupName}')">Delete Group</a>
//     // <div id="optionsSection">
//     //   <h4>Users:</h4>
//     //   <ul id="userList"></ul>
//     // </div>
//     // <input type="text" id="searchInput2" placeholder="Search User">
//     // <button onclick="searchUsers2()">Search</button>
//     // <div id="searchResults"></div>
//     // <button onclick="closeOptionsDialog()">Close</button>
//   </dialog>
// </li>


// TODO SEARCH USERS IN GROUP
async function searchUsers2() {
  const searchInput2 = document.getElementById('searchInput2');

  const searchQuery = searchInput2.value.trim();
  console.log('OR', searchQuery);

  if (searchQuery) {
    const userSearchResponse = await performUserSearch(searchQuery);
    console.log(userSearchResponse, 'return function');
    const searchResultsContainer = document.getElementById('searchResults');

    // Loop through the search results and create clickable elements
    userSearchResponse.forEach((user) => {
      const resultElement = document.createElement('div');
      resultElement.textContent = user.username;
      resultElement.onclick = () => {
        // CREATING OPTIONS MAKE ADMIN AND DELETE USER
        Options(user.username, user.id);
        // ADDING USERNAME TO GROUP DB
        addUserToGroupDB(user.username, user.id);
        searchResultsContainer.innerHTML = '';
      };
      searchResultsContainer.appendChild(resultElement);
    });
  }
}

// TODO SEARACH OPERATION
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
    console.log(
        'userserach return response --->',
        response.data.usersearchdetails,
    );
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

// TODO RETRIEVING USER CHAT MESSAGES

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

// TODO RETREIVING PERSONAL CHAT MESSAGES
// ! ASYNC REMOVED HERE
function UserChatMessages(username) {
  console.log('no msg these user previously');
  // console.log('MEHTODCALLED');
  // const token = localStorage.getItem('token');
  // let userPersonalChatResponse = [];
  // selectedUser = username;
  // const userid = {userId};
  // try {
  //   const response = await axios.get(
  //       'http://localhost:3000/personalmsgs', userid,
  //       {
  //         headers: {Authorization: token},
  //       },
  //   );
  //   userPersonalChatResponse = response.data;
  //   console.log(response.data, 'userPersonalChatResponseAPIDATA');
  // } catch (err) {
  //   console.log(err);
  // }
  // return userPersonalChatResponse;
  // showMessages(username, msg, timestamp);
}
// TODO GET GROUP NAMES
async function getGroupNames() {
  const token = localStorage.getItem('token');
  let groupResponse = [];
  try {
    const response = await axios.get('http://localhost:3000/getgroupnames', {
      headers: {Authorization: token},
    });
    groupResponse = response.data.groupDetails;
    console.log(response.data, 'GROUPDETAILSAPIDATA');
  } catch (err) {
    console.log(err);
  }
  return groupResponse;
}

console.log('GROUP NAME SELECTED', selectedGroup);

// TODO DELETE GROUP
async function deleteGroup(groupId) {
  const token = localStorage.getItem('token');
  console.log('DELETED GROUP ID', groupId);
  try {
    const response = await axios.delete(
        `http://localhost:3000/groups/${groupId}`,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);

    
  } catch (err) {
    console.log(err);
  }
}


function optionsDialog(groupId) {
  console.log('method called with groupId:', groupId);
  const dialog = document.getElementById('optionsDialog');
  dialog.showModal();
}

// Function to create the options dialog element and add it to the DOM
function createOptionsDialog() {
  const dialogElement = document.createElement('dialog');
  dialogElement.id = 'optionsDialog';

  // Add the dialog content here, you can customize it as per your requirements
  const dialogContent = document.createElement('div');
  dialogContent.id = 'optionsSection';
  dialogContent.innerHTML = `
    <h4>Group ID:</h4>
    <h4>Group Name:</h4>
    `;

  dialogElement.appendChild(dialogContent);
  document.body.appendChild(dialogElement);
}
console.log('groupSelectedInformation', groupSelectedInformation);


async function addUserToGroupDB(username, userId) {
  const groupId = groupSelectedInformation.group_id;
  console.log('I AM SENDING THIS GROUP ID WHILE ADDING USER TO GROUPDB', groupId);
  const user = {username, userId, groupId};
  const token = localStorage.getItem('token');
  console.log('ADDING USER TO GROUP ', user);
  try {
    const response = await axios.post(
        `http://localhost:3000/groups/addUser`, {user},
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}


async function deleteUser(username,groupid) {
  console.log(username,groupid, 'deleted user name from the group');
 
  const token = localStorage.getItem('token');
  const deleteUser = await { username,groupid};
  console.log('DELETING USER FROM THE  GROUP ', deleteUser);
  try {
    const response = await axios.delete(
        `http://localhost:3000/group/${deleteUser.groupid}/user/${deleteUser.username}`,
        {
          headers: {Authorization: token},
        },
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
