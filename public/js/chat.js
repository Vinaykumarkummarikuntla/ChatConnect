async function saveToDb(event){
    event.preventDefault()
    const msg = document.getElementById('message').value;
    console.log("msg",msg)
    const obj = { msg }
    const token = localStorage.getItem('token')
    console.log(token)

try{
   const response =  await axios
    .post('http://localhost:3000/chatdetails', obj,
     {
      headers: { Authorization: token }
    }
    )
      console.log(response)
      console.log(response.data,"FULLDATA")
      console.log(response.data.chatdetails.message,"MESSAGE")
      console.log(response.status,"STATUS")
      showMessages (response.data.chatdetails.message)
    
}
    catch(err){
      console.log(err)
    }
}

function showMessages (msg) {
    console.log('showMessages function called')
    console.log('Message:',msg)
    const parentElement = document.getElementById('chattable')
    childHTML = `<tr id =  ${msg}> <td>${msg} </td> </tr>`
    parentElement.innerHTML = parentElement.innerHTML + childHTML
}
