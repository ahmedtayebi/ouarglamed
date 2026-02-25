const bcrypt = require('bcrypt');
const hash = '$2b$10$4VlpLFkOfVyxBQifZxd6ZOplBNL/Pi9lxij4dYP2Gk/PzlTTMrASq';
bcrypt.compare('ahmedtayebi', hash).then(console.log);
