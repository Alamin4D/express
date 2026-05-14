import express, { type Application, type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: config.connection_string,
})


const initDB = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )    
            `);
        console.log("Database connected successfully!")
    } catch (error) {
        console.log(error)
    }
}

initDB()

app.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!')
    res.status(200).json({
        "message": "Express server",
        "author": "Next Level",
    })
})

app.post("/users", async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
        INSERT INTO users(name, email, password, age)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age]);

        // console.log(result)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(501).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `)
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.get("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
            `, [id])
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.put("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    // console.log("id: ", id),
    // console.log({name, password, age, is_active}) 
    try {
        const result = await pool.query(`
            UPDATE users SET 
            name=COALESCE($1,name), 
            password=COALESCE($2,password), 
            age=COALESCE($3,age),
            is_active=COALESCE($4,is_active)
            WHERE id=$5
            RETURNING *
            `, [name, password, age, is_active, id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        // console.log(result)
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})


app.delete("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1
            `, [id])
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        // console.log(result)
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
