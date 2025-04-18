const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as cmd parameter: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://KMStacker:${password}@cluster0.tbbll6s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    if (process.argv.length === 5) {
      const nameToAdd = process.argv[3];
      const numberToAdd = process.argv[4];

      const person = new Person({
        name: nameToAdd,
        number: numberToAdd,
      });

      return person.save()
        .then(savedPerson => {
          console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonefuck`);
        });
    }
    else if (process.argv.length === 3) {
      console.log('phonebook:');
      return Person.find({})
        .then(persons => {
          persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
          });
        });
    }
    else {
      console.log('error amount of parameters');
      return Promise.reject(new Error('Invalid arguments'));
    }
  })
  .then(() => {
    console.log('closing the shit');
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error('error:', err.message);
    mongoose.connection.close().catch(() => {});
    process.exit(1);
  });