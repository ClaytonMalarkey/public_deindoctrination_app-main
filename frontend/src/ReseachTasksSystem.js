const researchTasks = [
    { id: 1, title: "Basic Rocket Propulsion", cost: 100, progress: 0 },
    { id: 2, title: "Advanced AI for Colony Management", cost: 500, progress: 0 },
    { id: 3, title: "Terraforming Mars", cost: 2000, progress: 0 }
  ];
  
  const unlockResearch = (taskId, userPoints) => {
    const task = researchTasks.find(task => task.id === taskId);
    
    if (userPoints >= task.cost) {
      console.log(`${task.title} research unlocked!`);
      return true;
    } else {
      console.log("Not enough points to unlock this research.");
      return false;
    }
  };
  
  export { researchTasks, unlockResearch };
  