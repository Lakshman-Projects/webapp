import { validate as isUuid } from 'uuid';

const validateUUID = (req, res, next) => {
    const { id } = req.params;

    if (!isUuid(id)) {
        return res.status(400).send();
    }

    next();
};

export default validateUUID;
