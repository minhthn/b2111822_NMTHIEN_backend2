const { ObjectId } = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection('contacts');
    }

    exactContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        Object.keys(contact).forEach((key) => {
            if (contact[key] === undefined) {
                delete contact[key];
            }
        });
        return contact;
    }

    async create(payload) {
        const contact = this.exactContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: 'after', upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(name),
                $options: 'i', // ignore case
            }
        });
    }

    async findById(contactId) {
        const contact = await this.Contact.findOne({
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null
        });
        return contact;
    }

    async update(contactId, payload) {
        const filter = {
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null
        };
        const update = this.exactContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result;
    }

    async delete(contactId) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }

    async findAllFavorite() {
        return await this.find({ favorite: true });
    }
}

module.exports = ContactService;
