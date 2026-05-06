export function calculatePriority(notification){

  const {type,timestamp}=notification;

  let score=0;

  const typeWeights={
    Placement:50,
    Result:30,
    Event:10
  };

  score+=typeWeights[type]||0;

  const ageInHours=
    (Date.now()-new Date(timestamp))/
    (1000*60*60);

  if(ageInHours<24){
    score+=30;
  }else if(ageInHours<72){
    score+=20;
  }else if(ageInHours<168){
    score+=10;
  }

  return score;
}

export function sortByPriority(notifications){

  return notifications
    .map(notif=>({
      ...notif,
      priority:calculatePriority(notif)
    }))
    .sort((a,b)=>b.priority-a.priority)
    .slice(0,10);
}