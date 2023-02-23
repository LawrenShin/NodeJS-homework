import {Request, Response} from "express";
import GroupDAO from './GroupDAO';
import {formatGroup, validateGroup} from "../services/groupServices";
import {IGroup, IGroupOptional} from "../models";
import {mapErrors} from "../services";
import Joi from "joi";


export const getGroup = async (req: Request, res: Response) => {
    const group = await GroupDAO.getById(req.params.id);

    if (group) {
        return res.json(group);
    } else {
        return res.status(404).json({ error: 'Group not found.' })
    }
};

export const getGroups = async (req: Request, res: Response) => {
    try {
        const list = await GroupDAO.getAll();

        if (Array.isArray(list)) {
            if (!list.length) {
                res.json({message: 'Database is empty.'});
            }
            res.json(list);
        }
    } catch (e) {
        return res.status(400).json(e);
    }
}

export const removeGroup = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (id) {
        const result = await GroupDAO.delete(id);
        if (result) {
            return res.status(200).json('Group has been deleted');
        } else {
            return res.status(500).json('Something went wrong');
        }
    }
}

export const addGroup = async (req: Request, res: Response) => {
    const {body} = req;
    try {
        if (body) {
            const formatted = formatGroup(body);

            if (formatted) {
                const validated = validateGroup(formatted);

                if (Joi.isError(validated.error)) {
                    const mapped = mapErrors(validated.error.details);
                    res.status(400).json(mapped);
                }

                // @ts-ignore
                const result = (await GroupDAO.create(validated.value as unknown as IGroup)).get({raw: true});
                if (result) {
                    return res.status(201).json({result: result})
                } else {
                    return res.status(400).json({message: 'Group already exist'});
                }
            } else {
                return res.status(400).json({message: 'Couldn\'t format'});
            }
        } else {
            return res.status(400).json({message: 'Missing payload'});
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Something wrong'});
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    const {body} = req;

    if (body) {
        const validated = validateGroup(body);

        if (Joi.isError(validated.error)) {
            const mapped = mapErrors(validated.error.details);
            res.status(400).json(mapped);
        }

        const result = await GroupDAO.update(req.params.id, validated.value as unknown as IGroupOptional);

        if (result) {
            res.status(204).json();
        } else {
            return res.status(500).json({message: 'something went wrong'});
        }
    } else {
        return res.status(400).json({message: 'Missing payload'});
    }
};
