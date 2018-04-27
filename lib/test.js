const petService = require('../api/pet/service');

petService.getPetById({ petId: 1 }).then(pet => {
  console.log('Pet', pet);
})

petService.findPetsByStatus({
  status: ['available'],
}).then(pets => {
  console.log('Pets', pets);
})