import express, {Request, Response} from 'express';
import Joi, {Schema, ValidationErrorItem, ValidationResult} from 'joi';
import {IUserBasic, IUserToClient, IUserToService, MappedErrors, User, userSchema} from "./2_2";
import {DataTypes, Sequelize} from 'sequelize';

const sequelize = new Sequelize('postgres://newuser:pasword@localhost:5432/users_node_homework');
sequelize.authenticate()
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.log(err)
    });

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    login: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {tableName: 'users', timestamps: false,sequelize});

// consts
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const NotFoundByIDMessage = `User with this id not found`;

// helpers
const mapErrors = (schemaErrors: ValidationErrorItem[]): MappedErrors => {
    const errors = schemaErrors.map(({ message, path }) => ({ message, path }));

    return {
        status: 'failed',
        errors,
    };
};
const userGetter = async (id?: string) => {
    const options = {raw: true};

    if (id) {
        const result = await User.findOne({where: {id: id}, ...options});
        if (result?.isdeleted) {
            return null;
        }
        return result;
    } else {
        const result = await User.findAll(options);
        return result.filter(r => !r.isdeleted);
    }
};
const noServiceFields = (data: IUserToService[] | IUserToService): IUserToClient[] | IUserToClient => {
    if (Array.isArray(data)) {
        return data.map(({isdeleted, ...rest}) => rest);
    }
    const {isdeleted, ...rest} = data;
    return rest;
};
const validateUser = (newUser: IUserToService): ValidationResult<Schema<IUserBasic>> => {
    return userSchema.validate(newUser, { abortEarly: false, allowUnknown: false });
};
const handleUserCreation = async <T extends IUserBasic>(newUser: T) => {
    const options = {raw: true};
    const conditions = {where: {login: newUser.login}};
    const isPresent = await User.findOne({...options, ...conditions});
    if (isPresent)
        return false;

    // @ts-ignore
    return (await User.create(newUser, options)).get(options);
}

// middlewares
const getUser = async (req: Request, res: Response) => {
    const user = await userGetter(req.params.id);

    if (user) {
        res.json(noServiceFields(user));
    } else {
        res.status(404).json({ error: 'User not found.' })
    }
};
const addUser = async (req: Request, res: Response) => {
    const validated = validateUser(req.body);

    if (Joi.isError(validated.error)) {
        const mapped = mapErrors(validated.error.details);
        res.status(400).json(mapped);
    } else {
        // Note: Got lost here in types, not sure how to handle properly =(
        const result = await handleUserCreation(validated.value as unknown as IUserBasic);
        if (result) {
            res.json({result: noServiceFields(result), status: 201})
        } else {
            res.json({message: 'User already exist', status: 400});
        }
    }
};
const getUserList = async (req: Request, res: Response) => {
    const userList = await userGetter();

    if(Array.isArray(userList)) {
        if (!userList.length) {
            res.json({message: 'Database is empty.'});
        }
        res.json(noServiceFields(userList));
    }
};
const deleteUser = async (id: string): Promise<{ message: string }> => {
    const result = await User.update({ isdeleted: true }, {where: {id: id}});
    if (result) {
        return {message: `User has been deleted`};
    } else {
        return {message: `Something went wrong)`};
    }
};
const handleUpdateUser = async (id: string, updates: Partial<IUserToClient>) => {
    return await User.update(updates, {where: {id}});
};
const handleUserListByName = async (login: string, limit?: string): Promise<IUserToClient[] | []> => {
    const options = {raw: true, includes: {login}};
    const list = (await User.findAll(limit ? {...options, limit: Number(limit)} : options))
        .filter(u => ~u.login.indexOf(login))
        .sort((u1, u2) => u1.login.localeCompare(u2.login));

    const clientReadyList = noServiceFields(list);
    if (Array.isArray(clientReadyList)) {
        return clientReadyList;
    }

    return [];
};

// Note: In the beginning it was requested to have isDeleted field for soft deletion.
// But since sequelize has this out of box, it makes me feel like I am inventing the wheel instead of using default behavior of sequelize.
// Thus, I am using my own wheel with Model.update() instead of Model.drop()
const removeUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await userGetter(id);

    if (!user) {
        res.json({message: NotFoundByIDMessage, status: 400});
    } else {
        return await deleteUser(id);
    }
};
const updateUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const updates = req.body;
    const result = await handleUpdateUser(id, updates);
    // Note: I rly don't like these responses - [1/0]. What would be better to have here though?
    if (!result[0]) {
        res.json({message: NotFoundByIDMessage});
    } else {
        res.json({message: `User has been updated`});
    }
};

const getUserListByName = async (req: Request, res: Response) => {
    const { login } = req.params;
    const { limit } = req.query;
    if (!login) {
        res.json({message: 'Login can not be empty'});
    } else {
        // Note: also here not sure regarding type
        const list = await handleUserListByName(login, limit as any);
        res.json(list);
    }
};


// API by id
router.route('/users/:id')
    .get(getUser)
    .delete(removeUser)
    .patch(updateUser);

// API list
router.route('/users')
    .post(addUser)
    .get(getUserList);
router.route('/users/byName/:login')
    .get(getUserListByName);


app.use(express.json());
app.use(router);
app.listen(port);




// QUESTIONS
// middlewares are chained and composed in certain order. So should I use return in any and what happens if I do?