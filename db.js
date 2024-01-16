const mongoose=require('mongoose');

const uri = 'mongodb+srv://harmain16146:Harmain16146@mymongodbserver.aepmwek.mongodb.net/'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    family: 4 // Use IPv4, skip trying IPv6
}

const connectWithDB = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log('Database connection succeeded');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  }
};

connectWithDB()