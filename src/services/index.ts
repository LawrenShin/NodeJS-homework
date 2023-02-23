import {MappedErrors} from "../types";
import {ValidationErrorItem} from "joi";
export * from './userServices';

export const mapErrors = (schemaErrors: ValidationErrorItem[]): MappedErrors => {
    const errors = schemaErrors.map(({ message, path }) => ({ message, path }));

    return {
        status: schemaErrors.length ? 'failed' : 'success',
        errors,
    };
};

// export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500)
//     res.render('error', { error: err })
// }
