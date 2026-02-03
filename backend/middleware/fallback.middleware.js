const path = require('path');
const fs = require('fs');
const { getDBStatus } = require('../config/db.config');
const { DATA_FILES } = require('../config/constants');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Manages read/write of JSON data files when MongoDB is unavailable.
 */
class FallbackDataManager {
  constructor() {
    this.dataDir = DATA_DIR;
  }

  /**
   * Get full path for a data file.
   * @param {string} filename - Filename (e.g. expertStaff.json)
   * @returns {string}
   */
  _getFilePath(filename) {
    return path.join(this.dataDir, filename);
  }

  /**
   * Read JSON data from /data folder. Returns empty array on failure.
   * @param {string} filename - Filename in data folder
   * @returns {Array}
   */
  readFromFile(filename) {
    try {
      const filePath = this._getFilePath(filename);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn(`[Fallback] readFromFile(${filename}) failed:`, err.message);
      return [];
    }
  }

  /**
   * Write entire data array to JSON file. Pretty-print with 2 spaces.
   * @param {string} filename - Filename in data folder
   * @param {Array} data - Array of records
   * @returns {boolean}
   */
  writeToFile(filename, data) {
    try {
      const filePath = this._getFilePath(filename);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.warn(`[Fallback] writeToFile(${filename}) failed:`, err.message);
      return false;
    }
  }

  /**
   * Append new record to file. Adds id and createdAt if not present.
   * @param {string} filename - Filename in data folder
   * @param {Object} newData - New record (id/createdAt added if missing)
   * @returns {Object|null} Saved record or null on failure
   */
  appendToFile(filename, newData) {
    const data = this.readFromFile(filename);
    const record = { ...newData };
    if (!record.id) record.id = Date.now().toString();
    if (!record.createdAt) record.createdAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();
    data.push(record);
    return this.writeToFile(filename, data) ? record : null;
  }

  /**
   * Update record by id in file.
   * @param {string} filename - Filename in data folder
   * @param {string} id - Record id
   * @param {Object} updateData - Fields to update
   * @returns {Object|null} Updated record or null
   */
  updateInFile(filename, id, updateData) {
    const data = this.readFromFile(filename);
    const index = data.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    const updated = {
      ...data[index],
      ...updateData,
      id: data[index].id,
      updatedAt: new Date().toISOString(),
    };
    data[index] = updated;
    return this.writeToFile(filename, data) ? updated : null;
  }

  /**
   * Delete record by id from file.
   * @param {string} filename - Filename in data folder
   * @param {string} id - Record id
   * @returns {boolean}
   */
  deleteFromFile(filename, id) {
    const data = this.readFromFile(filename);
    const filtered = data.filter((item) => String(item.id) !== String(id));
    if (filtered.length === data.length) return false;
    return this.writeToFile(filename, filtered);
  }

  /**
   * Find single record by id.
   * @param {string} filename - Filename in data folder
   * @param {string} id - Record id
   * @returns {Object|null}
   */
  findById(filename, id) {
    const data = this.readFromFile(filename);
    return data.find((item) => String(item.id) === String(id)) || null;
  }

  /**
   * Filter data by query object. Supports exact match and basic range (min/max).
   * @param {string} filename - Filename in data folder
   * @param {Object} queryObject - e.g. { isActive: true, minPrice: 100, maxPrice: 200 }
   * @returns {Array}
   */
  findWithQuery(filename, queryObject) {
    let data = this.readFromFile(filename);
    if (!queryObject || Object.keys(queryObject).length === 0) {
      return data;
    }

    const { minPrice, maxPrice, minRating, ...exact } = queryObject;

    data = data.filter((item) => {
      for (const [key, value] of Object.entries(exact)) {
        if (value === undefined || value === null || value === '') continue;
        const itemVal = item[key];
        if (typeof value === 'string' && typeof itemVal === 'string') {
          if (!itemVal.toLowerCase().includes(value.toLowerCase())) return false;
        } else if (Array.isArray(itemVal) && typeof value === 'string') {
          if (!itemVal.some((v) => String(v).toLowerCase().includes(value.toLowerCase()))) return false;
        } else if (itemVal !== value) {
          return false;
        }
      }
      if (minPrice != null && (item.price == null || item.price < minPrice)) return false;
      if (maxPrice != null && (item.price == null || item.price > maxPrice)) return false;
      if (minRating != null && (item.rating == null || item.rating < minRating)) return false;
      return true;
    });

    return data;
  }
}

const fallbackManager = new FallbackDataManager();

/**
 * Middleware: sets req.useDB and req.fallbackManager based on DB status.
 */
function checkDBMiddleware(req, res, next) {
  req.useDB = getDBStatus();
  req.fallbackManager = fallbackManager;
  next();
}

module.exports = { FallbackDataManager, checkDBMiddleware, fallbackManager };
