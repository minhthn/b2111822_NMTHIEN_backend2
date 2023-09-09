exports.create = (req, res, next) => {
    res.json({ message: 'create handler '});
}

exports.findAll = (req, res, next) => {
    res.json({ message: 'findAll handler '});

}

exports.findOne = (req, res, next) => {
    res.json({ message: 'findOne handler '});
}

exports.update = (req, res, next) => {
    res.json({ message: 'update handler '});
}

exports.delete = (req, res, next) => {
    res.json({ message: 'delete handler '});
}

exports.deleteAll = (req, res, next) => {
    res.json({ message: 'deleteAll handler '});
}

exports.findAllFavorite = (req, res, next) => {
    res.json({ message: 'findAllFavorite handler '});
}
