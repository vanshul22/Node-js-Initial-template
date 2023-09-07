const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createConnection } = require('../config/database');
const jwtSecretKey = process.env.JWT_SECRET;

// Controller methods for user routes
const userController = {
    getAllUsers: async (req, res) => {
        // Retrieve and send a list of users from the database
        try {
            const connection = await createConnection();
            // Retrieve a list of users from the database
            const [rows, fields] = await connection.execute('SELECT * FROM users');
            connection.end(); // Close the connection when done

            // Check if there are no users found
            if (rows.length === 0) {
                return res.status(404).json({ result: [], message: 'No users found' });
            }

            // Send the list of users as a response
            return res.status(200).json({ result: rows, message: 'Successfully fetched' });
        } catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUserById: async (req, res) => {
        // Retrieve and send a user by ID from the database
        const userId = req.params.id;

        try {
            const connection = await createConnection();

            // Check if the user with the provided ID exists
            const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

            if (user.length === 0) {
                connection.end();
                return res.status(404).json({ error: 'User not found' });
            }

            connection.end();
            res.json({ user: user[0] });
        }
        catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    createUser: async (req, res) => {
        // Create a new user in the database
        const { username, password } = req.body;
        try {
            const connection = await createConnection();

            // Check if the username already exists in the database
            const [existingUsers] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

            if (existingUsers.length > 0) {
                // Username already exists
                connection.end();
                return res.status(400).json({ error: 'Username already in use' });
            }

            // Hash the user's password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

            // Insert a new user into the database
            const [rows, fields] = await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
            const userId = rows.insertId; // Assuming your database returns the newly inserted user's ID

            connection.end();
            // Create a JWT token for the newly registered user
            const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: '1h' }); // Token expires in 1 hour
            res.status(201).json({ message: 'User created successfully', token });

        } catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    loginUser: async (req, res) => {
        // Create a new user in the database
        const { username, password } = req.body;
        try {

            const connection = await createConnection();

            // Fetch user data based on the provided username
            const [rows] = await connection.execute(`SELECT * FROM users WHERE username = '${username}'`);

            if (rows.length === 0) {
                // User not found
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = rows[0];

            // Check if the provided password matches the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                // Password is incorrect
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Create a JWT token for the authenticated user
            const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: '1h' }); // Token expires in 1 hour

            connection.end();

            res.status(201).json({ message: 'Login successful', token });

        } catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateUser: async (req, res) => {
        // Update a user in the database by ID
        const { username, newPassword } = req.body;
        const id = req.params.id;

        try {
            const connection = await createConnection();

            // Check if the user with the given ID exists in the database
            const [existingUsers] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);

            if (existingUsers.length === 0) {
                // User does not exist
                connection.end();
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password before updating it in the database
            const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds

            // Update the user's username and password in the database
            const [rows, fields] = await connection.execute('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id]);

            connection.end();

            if (rows.affectedRows === 1) {
                // User updated successfully
                return res.status(200).json({ message: 'User updated successfully' });
            } else {
                // Failed to update user
                return res.status(500).json({ error: 'Failed to update user' });
            }

        } catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    },
    deleteUser: async (req, res) => {
        // Delete a user from the database by ID
        const userId = req.params.id;
        try {
            const connection = await createConnection();

            // Check if the user with the provided ID exists
            const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

            if (user.length === 0) {
                connection.end();
                return res.status(404).json({ error: 'User not found' });
            }

            // Delete the user from the database
            await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
            connection.end();

            // Use a 204 status code for a successful deletion (No Content)
            res.status(204).send();

        } catch (error) {
            // Handle database errors or other exceptions
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = userController;
