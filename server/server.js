const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const SECRET_KEY = 'cafe-management'; // Change this to a strong secret key

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Initialize database
const db = new sqlite3.Database('./cafe.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'staff', 'customer')),
      name TEXT
    )`);

    // Create food_items table
    db.run(`CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imageURL TEXT,
      price REAL NOT NULL,
      ratings REAL
    )`);

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      items TEXT NOT NULL, -- JSON string of items
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Create carts table
    db.run(`CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      items TEXT NOT NULL, -- JSON string of cart items
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Insert admin user if not exists
  const adminEmail = 'admin@gmail.com';
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (!row) {
        const hashedPassword = bcrypt.hashSync('1234', 8);
        db.run(
          'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
          [adminEmail, hashedPassword, 'admin', 'Admin'],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Admin user created');
            }
          }
        );
      }
    });

    // Insert some initial food items if table is empty
    db.get('SELECT COUNT(*) as count FROM food_items', (err, row) => {
      if (row.count === 0) {
        const initialItems = [
          { name: 'Baked Chicken Wings', imageURL: 'https://plus.unsplash.com/premium_photo-1664391997303-dab867f07ad4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFrZWQlMjBDaGlja2VuJTIwV2luZ3N8ZW58MHwwfDB8fHww', price: 10.99, ratings: 4.5 },
          { name: 'Margherita Pizza', imageURL: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFyZ2hlcml0YSUyMFBpenphfGVufDB8MHwwfHx8MA%3D%3D', price: 8.99, ratings: 4.7 },
          { name: 'Caesar Salad', imageURL: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2Flc2FyJTIwU2FsYWR8ZW58MHwwfDB8fHww', price: 6.99, ratings: 4.3 }
        ];
        
        const stmt = db.prepare('INSERT INTO food_items (name, imageURL, price, ratings) VALUES (?, ?, ?, ?)');
        initialItems.forEach(item => {
          stmt.run(item.name, item.imageURL, item.price, item.ratings);
        });
        stmt.finalize();
      }
    });
  });
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Incoming token:', token);
// console.log('Decoded user:', user);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403);
    }
    
    // Verify the user exists in database
    db.get('SELECT * FROM users WHERE id = ?', [user.id], (dbErr, dbUser) => {
      if (dbErr || !dbUser) {
        console.error('User not found in database');
        return res.sendStatus(403);
      }
      
      req.user = dbUser; // Use database user instead of token payload
      next();
    });
  });
}

// Check if user is admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

// Check if user is staff or admin
function isStaffOrAdmin(req, res, next) {
  if (req.user.role !== 'staff' && req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

// Auth Routes
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'customer', name],
      function(err) {
        if (err) {
          return res.status(500).send('Error registering user');
        }
        
        const token = jwt.sign({ id: this.lastID, email, role: 'customer' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: this.lastID, email, role: 'customer', name } });
      }
    );
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid email or password');
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  });
});

// Food Items CRUD
app.get('/api/food-items', (req, res) => {
  db.all('SELECT * FROM food_items', (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching food items');
    }
    res.json(rows);
  });
});

app.post('/api/food-items', authenticateToken, isAdmin, (req, res) => {
  const { name, imageURL, price, ratings } = req.body;
  
  db.run(
    'INSERT INTO food_items (name, imageURL, price, ratings) VALUES (?, ?, ?, ?)',
    [name, imageURL, price, ratings],
    function(err) {
      if (err) {
        return res.status(500).send('Error adding food item');
      }
      
      db.get('SELECT * FROM food_items WHERE id = ?', [this.lastID], (err, row) => {
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/food-items/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const { name, imageURL, price, ratings } = req.body;
  
  db.run(
    'UPDATE food_items SET name = ?, imageURL = ?, price = ?, ratings = ? WHERE id = ?',
    [name, imageURL, price, ratings, id],
    function(err) {
      if (err) {
        return res.status(500).send('Error updating food item');
      }
      
      if (this.changes === 0) {
        return res.status(404).send('Food item not found');
      }
      
      db.get('SELECT * FROM food_items WHERE id = ?', [id], (err, row) => {
        res.json(row);
      });
    }
  );
});

app.delete('/api/food-items/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM food_items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).send('Error deleting food item');
    }
    
    if (this.changes === 0) {
      return res.status(404).send('Food item not found');
    }
    
    res.status(204).send();
  });
});

// Cart Endpoints
app.get('/api/cart', authenticateToken, (req, res) => {
  db.get('SELECT * FROM carts WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).send('Error fetching cart');
    }
    
    res.json(row ? { items: JSON.parse(row.items) } : { items: [] });
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { items } = req.body;
  
  db.run(
    'INSERT OR REPLACE INTO carts (user_id, items) VALUES (?, ?)',
    [req.user.id, JSON.stringify(items)],
    function(err) {
      if (err) {
        return res.status(500).send('Error updating cart');
      }
      
      res.json({ items });
    }
  );
});

// Order Endpoints
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total } = req.body;
  
  db.run(
    'INSERT INTO orders (user_id, items, total, status) VALUES (?, ?, ?, ?)',
    [req.user.id, JSON.stringify(items), total, 'pending'],
    function(err) {
      if (err) {
        return res.status(500).send('Error creating order');
      }
      
      // Clear the cart after order is placed
      db.run('DELETE FROM carts WHERE user_id = ?', [req.user.id], () => {
        db.get('SELECT * FROM orders WHERE id = ?', [this.lastID], (err, order) => {
          res.status(201).json({
            ...order,
            items: JSON.parse(order.items)
          });
        });
      });
    }
  );
});

app.get('/api/orders', authenticateToken, (req, res) => {
  if (req.user.role === 'customer') {
    db.all('SELECT * FROM orders WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching orders');
      }
      
      res.json(rows.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      })));
    });
  } else {
    // Staff and admin can see all orders
    db.all('SELECT * FROM orders', (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching orders');
      }
      
      res.json(rows.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      })));
    });
  }
});

app.put('/api/orders/:id/status', authenticateToken, isStaffOrAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).send('Error updating order status');
      }
      
      if (this.changes === 0) {
        return res.status(404).send('Order not found');
      }
      
      db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
        res.json({
          ...order,
          items: JSON.parse(order.items)
        });
      });
    }
  );
});

// Staff Management (Admin only)
app.get('/api/staff', authenticateToken, isAdmin, (req, res) => {
  db.all('SELECT id, email, name FROM users WHERE role = ?', ['staff'], (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching staff');
    }
    res.json(rows);
  });
});

app.post('/api/staff', authenticateToken, isAdmin, (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).send('All fields are required');
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'staff', name],
      function(err) {
        if (err) {
          return res.status(500).send('Error adding staff member');
        }
        
        db.get('SELECT id, email, name FROM users WHERE id = ?', [this.lastID], (err, user) => {
          res.status(201).json(user);
        });
      }
    );
  });
});

app.put('/api/staff/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  if (!email || !name) {
    return res.status(400).send('Email and name are required');
  }

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, staff) => {
    if (!staff || staff.role !== 'staff') {
      return res.status(404).send('Staff member not found');
    }

    let updateQuery = 'UPDATE users SET email = ?, name = ? WHERE id = ?';
    let params = [email, name, id];

    // Only update password if it was provided
    if (password && password.trim() !== '') {
      const hashedPassword = bcrypt.hashSync(password, 8);
      updateQuery = 'UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?';
      params = [email, name, hashedPassword, id];
    }

    db.run(updateQuery, params, function(err) {
      if (err) {
        return res.status(500).send('Error updating staff member');
      }

      db.get('SELECT id, email, name FROM users WHERE id = ?', [id], (err, updatedStaff) => {
        res.json(updatedStaff);
      });
    });
  });
});

app.delete('/api/staff/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM users WHERE id = ? AND role = ?', [id, 'staff'], function(err) {
    if (err) {
      return res.status(500).send('Error deleting staff member');
    }
    
    if (this.changes === 0) {
      return res.status(404).send('Staff member not found');
    }
    
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});