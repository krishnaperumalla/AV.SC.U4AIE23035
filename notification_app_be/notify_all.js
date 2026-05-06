const axios=require('axios');

async function notify_all(student_ids,message){

  const promises=student_ids.map(student_id=>

    axios.post('http://localhost:3000/api/notifications',{
      student_id,
      message
    })

  );

  try{

    await Promise.all(promises);

    console.log(`Sent ${student_ids.length} notifications`);

  }catch(error){

    console.log('Notification sending failed');

  }
}

const studentIds=Array.from(
  {length:50000},
  (_,i)=>i+1
);

notify_all(
  studentIds,
  'Placement notification: Check your results!'
);