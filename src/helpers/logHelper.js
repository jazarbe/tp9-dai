import 'dotenv/config'
import fs from 'fs';
import path from 'path';

class LogHelper {
    constructor() {
        this.filePath = process.env.LOG_FILE_PATH;
        this.fileName = process.env.LOG_FILE_NAME;
        this.logToFileEnabled = (process.env.LOG_TO_FILE_ENABLED || 'false').toLowerCase() === 'true';
        this.logToConsoleEnabled = (process.env.LOG_TO_CONSOLE_ENABLED || 'true').toLowerCase() === 'true';
    }
    /**
     * * Este método almacena en un archivo de texto y/o por muestra consola información del Error.
     * * @param {*} errorObject
     * */
    
    getRoute = () => {
        return path.join(this.filePath || '', this.fileName || '');
    }

    logError = (errorObject) => {
        const errorString = errorObject instanceof Error
            ? `${errorObject.name}: ${errorObject.message}\n${errorObject.stack}`
            : typeof errorObject === 'object'
                ? JSON.stringify(errorObject, null, 2)
                : String(errorObject);

        const logEntry = `${new Date().toISOString()} - ${errorString}\n`;

        if (this.logToConsoleEnabled) {
            console.error(logEntry);
        }

        if (this.logToFileEnabled && this.filePath && this.fileName) {
            fs.appendFile(this.getRoute(), logEntry, (err) => {
                if (err) {
                    console.error('Failed to write log file:', err);
                }
            });
        }
    }
}

export default new LogHelper();