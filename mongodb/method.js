// Khai bao MongoClient
const { MongoClient, ObjectId } = require('mongodb');
const { ObjectID } = require('mongodb');

const DATABASE_NAME = 'Online_Shop';
const CONNECTION_STRING = 'mongodb://localhost:27017/' + DATABASE_NAME;

// INSERT: Thêm mới (một)
function insertDocument(data, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                collection
                    .insertOne(data)
                    .then((result) => resolve({ data: data, result: result }))
                    .catch((err) => reject(err))
                    .finally(() => {
                        client.close();
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// INSERT: Thêm mới (nhiều)
function insertDocuments(data, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                collection
                    .insertMany(data)
                    .then((result) => resolve({ data: data, result: result }))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

// UPDATE: Sửa theo ID
function updateDocumentByID(id, data, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                const query = { _id: ObjectID(id) };
                collection
                    .findOneAndUpdate(query, { $set: data })
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

// UPDATE: Sửa (nhiều)
function updateDocuments(query, data, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                collection
                    .updateMany(query, { $set: data })
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

// DELETE: Xoá
function deleteDocument(id, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                const query = { _id: ObjectId(id) };
                collection
                    .deleteOne(query)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

// DELETE MANY
function deleteDocuments(query, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                collection
                    .deleteMany(query)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}
// Find by ID
function findDocument(id, collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                const query = { _id: ObjectId(id) };
                collection
                    .findOne(query)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

// Find many
function findDocuments(query, collectionName, sort, limit = 10, aggregate = [], skip = 0, projection = {}) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_STRING)
            .then((client) => {
                const dbo = client.db(DATABASE_NAME);
                const collection = dbo.collection(collectionName);
                collection
                    // .aggregate(aggregate)
                    .find(query)
                    .sort(sort)
                    .limit(limit)
                    .skip(skip)
                    .project(projection)
                    .toArray()

                    .then((result) => resolve(result))
                    .catch((err) => reject(err))
                    .finally(() => client.close());
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    insertDocument,
    insertDocuments,
    updateDocumentByID,
    deleteDocument,
    deleteDocuments,
    findDocument,
    findDocuments,
};
