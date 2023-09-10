const ContactService = require('../services/contact.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

// POST /api/contacts/
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, 'Name cannot be empty'));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const newContact = await contactService.create(req.body);
        return res.json({
            contact: newContact
        });        
    } catch (err) {
        return next(new ApiError(500,
            `An error occurred while creating the contact: ${err.message}`
        ));
    }
}

// GET /api/contacts/
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (err) {
        return next(new ApiError(500,
            `An error occurred while retrieving contacts: ${err.message}`,
        ));
    }
    res.json({
        total: documents.length,
        documents,
    });
}

// GET /api/contacts/:id
exports.findOne = async (req, res, next) => {
    const contactId = req.params.id;
    try {
        const contactService = new ContactService(MongoDB.client);
        const contact = await contactService.findById(contactId);
        if (!contact) {
            return next(new ApiError(404,
                `No such contact with id: '${contactId}'`
            ));
        }
        res.json({ contact });
    } catch (err) {
        return next(new ApiError(500,
            `An error occurred while retrieving contact with id: '${contactId}'`
        ));
    }
}

// PUT /api/contacts/:id
exports.update = async (req, res, next) => {
    const contactId = req.params.id;
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 
            'No data supplied'
        ));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const updatedContact = await contactService.update(contactId, req.body);
        if (!updatedContact) {
            return next(new ApiError(404, 
                `No such contact with id: '${contactId}'`
            ));
        }
        res.json({
            message: 'Update contact successfully',
            contact: updatedContact
        });
    } catch (err) {
        return next(new ApiError(500,
            `An error occurred while updating contact with id: '${contactId}'`
        ));
    }
}

// DELETE /api/contacts/:id
exports.delete = async (req, res, next) => {
    const contactId = req.params.id;
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedContact = await contactService.delete(contactId);
        if (!deletedContact) {
            return next(new ApiError(404, 
                `No such contact with id: '${contactId}'`
            ));
        }
        res.json({
            message: 'Delete contact successfully',
            contact: deletedContact
        });
    } catch (err) {
        return next(new ApiError(500,
            `An error occurred while deleting contact with id: '${contactId}'`
        ));
    }
}

// DELETE /api/contacts/
exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        res.json({
            message: `${deletedCount} contacts were deleted successfully`
        });
    } catch (err) {
        return next(new ApiError(500,
            'An error occurred while deleting all contacts'
        ));
    }
}

// GET /api/contacts/favorite
exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const favoriteContacts = await contactService.findAllFavorite();
        res.json({
            total: favoriteContacts.length,
            contacts: favoriteContacts
        });
    } catch (err) {
        return next(new ApiError(500,
            'An error occurred while retrieving favorite contacts'
        ));
    }
}
