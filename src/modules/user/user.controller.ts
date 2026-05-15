import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password, age } = req.body;

    try {
        const result = await userService.createUserIntoDB(req.body);

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
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsersFromDB();
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
}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const result = await userService.getSingleUserFromDB(id as string)
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
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    // console.log("id: ", id),
    // console.log({name, password, age, is_active}) 
    try {
        const result = await userService.updateUserFromDB(req.body, id as string)
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
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);
    try {
        const result = await pool.query(`
            DELETE FROM users 
            WHERE id = $1
            RETURNING *
            `, [id])
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        // console.log(result)
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data : result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
}