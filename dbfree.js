// socket.on('join-room', (username) => {
//     recipientUsername = username;
//     // Get the ID of the recipient's socket
//     socket.join(username.replace(' ', '-'));
//     console.log(`User ${username} joined the room with ID ${socket.id}`);


//     socket.on('send-chat-message', (message) => {
//       console.log('message incoming');
//       console.log(message);
      
//       message.senderUsername = senderUsername;
//       console.log(message,"after sendusername added")
//       if (recipientUsername) {
//         io.to(recipientUsername.replace(' ', '-')).emit('chat-message', {
//           message,
//         });
//         console.log('message sent from the backend to frontend');
//       } else {
//         console.log('Recipient username is not set or invalid.');
//       }
//     });
//   //   // Ensure we have the recipient's username before sending the message
//   });