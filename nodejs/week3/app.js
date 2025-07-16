import express from 'express';
import knex from 'knex';

// Create a Knex instance to connect to MySQL
const knexInstance = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'my-secret-pw',
    database: process.env.DB_NAME || 'hyf_node_week3_warmup',
    multipleStatements: true // Required for demonstration but dangerous if misused
  }
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiRouter = express.Router();
app.use('/api', apiRouter);

const contactsAPIRouter = express.Router();
apiRouter.use('/contacts', contactsAPIRouter);

// Unsafe version - vulnerable to SQL injection (commented out)
/*
contactsAPIRouter.get('/', async (req, res) => {
  let query = knexInstance.select('*').from('contacts');

  if ('sort' in req.query) {
    const orderBy = req.query.sort.toString();

    // This is insecure: directly injecting user input into raw SQL
    // Example: ?sort=first_name; DROP TABLE contacts
    if (orderBy.length > 0) {
      query = query.orderByRaw(orderBy);
    }
  }

  try {
    const data = await query;
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

// Secure version - prevents SQL injection
contactsAPIRouter.get('/', async (req, res) => {
  let query = knexInstance.select('*').from('contacts');

  if ('sort' in req.query) {
    const [column, direction] = req.query.sort.toString().split(' ');

    // Only allow sorting by specific columns and directions
    const allowedColumns = ['first_name', 'last_name'];
    const allowedDirections = ['ASC', 'DESC'];

    if (
      allowedColumns.includes(column) &&
      allowedDirections.includes((direction || '').toUpperCase())
    ) {
      query = query.orderBy(column, direction.toUpperCase());
    } else {
      return res.status(400).json({
        error: 'Invalid sort parameter. Allowed format: ?sort=first_name ASC'
      });
    }
  }

  try {
    const data = await query;
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
