import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
let localDir = __dirname.replace(/^\\/, '');

let configDir = localDir.replace(/^\//, 'file:///');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = (await import(path.join(configDir, '..', 'config', 'config.js'))).default[env];

const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let filePath = path.join(localDir).replace(/^\\/, '');

async function loadModels() {
  const files = fs.readdirSync(filePath).filter(file => {
    return file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1;
  });

  for (const file of files) {
    let fileUrl = path.resolve(filePath, file);
    fileUrl = `file://${fileUrl.replace(/\\/g, '/')}`;
    const model = await import(fileUrl);
    const modelInstance = model.default(sequelize, DataTypes);
    db[modelInstance.name] = modelInstance;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}

// Call loadModels function and wait for it to complete
await loadModels();

export default db;
