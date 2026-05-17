import type { Request, Response } from "express"
import { profileService } from "./profile.service"


const createProfile = async (req: Request, res: Response) => {
    try {
        const result = await profileService.createProfileInsetDB(req.body);
        res.status(201).json({
            success: true,
            message: "Profile created successfully!",
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

const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const result = await profileService.getAllProfilesFromDB();
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
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

const getSingleProfile = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await profileService.getSingleProfileFromDB(id as string);
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
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

export const profileController = {
    createProfile,
    getAllProfiles,
    getSingleProfile,
}