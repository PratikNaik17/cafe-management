const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 3001;

app.use(cors()); 
app.use(bodyParser.json());


let foodItems = [
    {
        id: 1,
        name: 'Baked Chicken Wings',
        imageURL: 'https://plus.unsplash.com/premium_photo-1664391997303-dab867f07ad4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFrZWQlMjBDaGlja2VuJTIwV2luZ3N8ZW58MHwwfDB8fHww',
        price: 10.99,
        ratings: 4.5,
      },
      {
        id: 2,
        name: 'Margherita Pizza',
        imageURL: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFyZ2hlcml0YSUyMFBpenphfGVufDB8MHwwfHx8MA%3D%3D',
        price: 8.99,
        ratings: 4.7,
      },
      {
        id: 3,
        name: 'Caesar Salad',
        imageURL: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2Flc2FyJTIwU2FsYWR8ZW58MHwwfDB8fHww',
        price: 6.99,
        ratings: 4.3,
      },
      {
        id: 4,
        name: 'Spaghetti Carbonara',
        imageURL: 'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3BhZ2hldHRpJTIwQ2FyYm9uYXJhfGVufDB8MHwwfHx8MA%3D%3D',
        price: 12.49,
        ratings: 4.6,
      },
      {
        id: 5,
        name: 'Cheeseburger',
        imageURL: 'https://images.unsplash.com/photo-1603508102981-f44b20e0c124?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q2hlZXNlYnVyZ2VyfGVufDB8MHwwfHx8MA%3D%3D',
        price: 9.99,
        ratings: 4.4,
      },
      {
        id: 6,
        name: 'Sushi Platter',
        imageURL: 'https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3VzaGklMjBQbGF0dGVyfGVufDB8MHwwfHx8MA%3D%3D',
        price: 15.99,
        ratings: 4.8,
      },
      {
        id: 7,
        name: 'Chocolate Cake',
        imageURL: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hvY29sYXRlJTIwQ2FrZXxlbnwwfDB8MHx8fDA%3D',
        price: 5.99,
        ratings: 4.9,
      },
      {
        id: 8,
        name: 'Grilled Salmon',
        imageURL: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R3JpbGxlZCUyMFNhbG1vbnxlbnwwfDB8MHx8fDA%3D',
        price: 14.99,
        ratings: 4.7,
      },
      {
        id: 9,
        name: 'Tacos',
        imageURL: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VGFjb3N8ZW58MHwwfDB8fHww',
        price: 7.99,
        ratings: 4.5,
      },
      {
        id: 10,
        name: 'Pancakes',
        imageURL: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFuY2FrZXN8ZW58MHwwfDB8fHww',
        price: 4.99,
        ratings: 4.6,
      },
      {
        id: 11,
        name: 'Pizza',
        imageURL: 'https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png',
        price: 9.50,
        ratings: 4.6,
      },
      {
        id: 12,
        name: 'Burger',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/ccb7dc2ba2b054419f805da7f05704471634886169.png',
        price: 7.75,
        ratings: 4.5,
      },
      {
        id: 13,
        name: 'Sandwich',
        imageURL: 'https://b.zmtcdn.com/data/o2_assets/fc641efbb73b10484257f295ef0b9b981634401116.png',
        price: 5.00,
        ratings: 4.4,
      },
      {
        id: 14,
        name: 'Dosa',
        imageURL: 'https://b.zmtcdn.com/data/o2_assets/8dc39742916ddc369ebeb91928391b931632716660.png',
        price: 4.25,
        ratings: 4.7,
      },
      {
        id: 15,
        name: 'Paneer',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/e44c42ff4b60b025225c8691ef9735b11635781903.png',
        price: 6.50,
        ratings: 4.3,
      },
      {
        id: 16,
        name: 'Chicken',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/197987b7ebcd1ee08f8c25ea4e77e20f1634731334.png',
        price: 8.00,
        ratings: 4.8,
      },
      {
        id: 17,
        name: 'Biryani',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/d19a31d42d5913ff129cafd7cec772f81639737697.png',
        price: 12.00,
        ratings: 4.9,
      },
      {
        id: 18,
        name: 'Momos',
        imageURL: 'https://b.zmtcdn.com/data/o2_assets/5dbdb72a48cf3192830232f6853735301632716604.png',
        price: 3.75,
        ratings: 4.2,
      },
      {
        id: 19,
        name: 'Rolls',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/c2f22c42f7ba90d81440a88449f4e5891634806087.png',
        price: 5.50,
        ratings: 4.1,
      },
      {
        id: 20,
        name: 'Cake',
        imageURL: 'https://b.zmtcdn.com/data/dish_images/d5ab931c8c239271de45e1c159af94311634805744.png',
        price: 7.00,
        ratings: 4.6,
      },
   
];


app.get('/api/food-items', (_req, res) => {
  res.json(foodItems);
});


app.post('/api/food-items', (req, res) => {
  const newItem = req.body;
  newItem.id = foodItems.length + 1; 
  foodItems.push(newItem);
  res.status(201).json(newItem);
});


app.put('/api/food-items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const index = foodItems.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    foodItems[index] = { ...foodItems[index], ...updatedItem };
    res.json(foodItems[index]);
  } else {
    res.status(404).send('Food item not found');
  }
});


app.delete('/api/food-items/:id', (req, res) => {
  const { id } = req.params;
  const index = foodItems.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    foodItems.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Food item not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});