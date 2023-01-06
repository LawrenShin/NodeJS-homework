const defMap = Object.entries(
    {
        "403357.1108310962": {
            "name": "Asteriks",
            "kills": 90,
            "password": "g4G",
            "isDeleted": false
        },
        "403353.9108310968": {
            "name": "Varmid",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "8687296.470471686": {
            "name": "Olaf",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "8489232.1256684": {
            "name": "Hold",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "912165.7183257148": {
            "name": "Tor",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "5938013.000591949": {
            "name": "Goro",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "2758694.634640233": {
            "name": "Valhen",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "4539556.105923821": {
            "name": "Valder",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        },
        "2336200.519486169": {
            "name": "Varmin",
            "kills": 9,
            "password": "g4G",
            "isDeleted": false
        }
    }
);


const express = require('express');
const Joi = require('joi');
const app = express();
const router = express.Router();
const vikingSchema = require('./2_2');

// EXAMPLE of viking
// {
//     "id": "5354554357345",
//     "name": "Olaf",
//     "kills": 0,
//     "password": 'a2A',
//     "isDeleted": false
// }

const mapErrors = (schemaErrors) => {
    const errors = schemaErrors.map(({ message, path }) => ({ message, path }));

    return {
        status: 'failed',
        errors,
    };
};

// helpers
const vikingGetter = id => {
    const viking = valhalla.get(id);
    if (!viking || viking.isDeleted) {
        return false;
    }

    return viking;
};

// middlewares
const getViking = (req, res) => {
    const viking = vikingGetter(req.params.id);

    if (!viking) {
        res.status(404).json({ error: 'Viking not found.' })
    } else {
        res.json(viking);
    }
};
const removeViking = (req, res) => {
    const viking = vikingGetter(req.params.id);
    if (!viking) {
        res.json({message: `Viking ${ viking.name } not found`});
    } else {
        valhalla.set(req.params.id, { ...viking, isDeleted: true });
        res.json({message: `Viking ${ viking.name } has been removed`});
    }
};
const updateViking = (req, res) => {
    const viking = vikingGetter(req.params.id);
    const updates = req.body;
    if (!viking) {
        res.json({message: `Viking ${ viking.name } not found`});
    } else {
        valhalla.set(req.params.id, { ...viking, ...updates });
        res.json({message: `Viking ${ viking.name } has been updated`});
    }
};
const addViking = (req, res) => {
    const newViking = req.body;
    const result = vikingSchema.validate(newViking, { abortEarly: false, allowUnknown: false });

    if (Joi.isError(result.error)) {
        const mapped = mapErrors(result.error.details);
        res.status(400);
        res.json(mapped);
    } else {
        const id = `${Math.random() * 10000000}`;
        valhalla.set(id, newViking);
        res.status(201);
        res.json({ ...newViking, id });
    }
};
const getValhalla = (req, res) => {
    const entries = Object.fromEntries(valhalla);
    if (!Object.keys(entries).length) {
        res.json({message: 'Valhalla is empty.'});
    } else {
        res.json(entries);
    }
};
const getValhallaByName = (req, res) => {
    const { name } = req.params;
    const { limit } = req.query;
    if (!name) {
        res.json({message: 'Name can not be empty'});
    } else {
        const sorted = [...valhalla]
            .filter(v => ~v[1].name.indexOf(name))
            .sort(([k1], [k2]) => k1.localeCompare(k2));

        res.json({ sorted: limit ? sorted.splice(0, limit) : sorted});
    }
}


// API by id
router.route('/valhalla/:id')
    .get(getViking)
    .delete(removeViking)
    .patch(updateViking);

// API add
router.route('/valhalla/add')
    .post(addViking);

// API list
router.route('/valhalla')
    .get(getValhalla);
router.route('/valhalla/byName/:name')
    .get(getValhallaByName);


// init
const valhalla = new Map(defMap);
const port = process.env.PORT || 3000;

app.use('/', express.json());
app.use('/', router);
app.listen(port);




// QUESTIONS
// where did id go once I placed # in front of value in url? Because viking/:id works same as /valhalla when I do.
// middlewares are chained and composed in certain order. So should I use return in any and what happens if I do?
// localhost:3000/valhalla/byName returns viking not found. Why?