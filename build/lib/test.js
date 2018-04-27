'use strict';

var petService = require('../api/pet/service');

petService.getPetById({ petId: 1 }).then(function (pet) {
  console.log('Pet', pet);
});

petService.findPetsByStatus({
  status: ['available']
}).then(function (pets) {
  console.log('Pets', pets);
});