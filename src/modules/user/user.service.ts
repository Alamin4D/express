import { pool } from "../../db";
import type { TUser } from "./user.interface";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payLoad: TUser) => {
    const { name, email, password, age } = payLoad

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, age)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `, [name, email, hashPassword, age]);

    delete result.rows[0].password

    return result;
}

const getAllUsersFromDB = async () => {
    const result = await pool.query(`
            SELECT * FROM users
            `)
    delete result.rows[0].password
    return result
}

const getSingleUserFromDB = async (id: string) => {
    const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
            `, [id])
    delete result.rows[0].password
    return result;
}

const updateUserFromDB = async (payLoad: TUser, id: string) => {
    const { name, password, age, is_active } = payLoad
    const result = await pool.query(`
            UPDATE users SET 
            name=COALESCE($1,name), 
            password=COALESCE($2,password), 
            age=COALESCE($3,age),
            is_active=COALESCE($4,is_active)
            WHERE id=$5
            RETURNING *
            `, [name, password, age, is_active, id]);
    return result;
}

const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id = $1
            `, [id])
    return result
}

export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    deleteUserFromDB,
}