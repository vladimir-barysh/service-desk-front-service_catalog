/* eslint-disable */
const fs = require('fs');
const { execSync } = require('child_process');

const OPENAPI_PATH = './openapi.json';
const OUTPUT_TYPES_PATH = './src/types/api.ts';
const TEMP_PATH = './temp-openapi.json';

// Сопоставление имени JsonNullable с inline-определением
const jsonNullableMap = {
    'JsonNullableString': { type: 'string' },
    'JsonNullableInteger': { type: 'integer', format: 'int32' },
    'JsonNullableLong': { type: 'integer', format: 'int64' },
    'JsonNullableFloat': { type: 'number', format: 'float' },
    'JsonNullableDouble': { type: 'number', format: 'double' },
    'JsonNullableNumber': { type: 'number' },
    'JsonNullableBoolean': { type: 'boolean' },
    'JsonNullableInstant': { type: 'string', format: 'date-time' },
    'JsonNullableDate': { type: 'string', format: 'date' },
    'JsonNullableLocalDate': { type: 'string', format: 'date' },
    'JsonNullableLocalDateTime': { type: 'string', format: 'date-time' },
};

function generate() {
    try {
        let schemaText = fs.readFileSync(OPENAPI_PATH, 'utf8');

        // Заменяем ссылки на JsonNullable на типы с nullable
        for (const [schemaName, inlineSchema] of Object.entries(jsonNullableMap)) {
            const pattern = new RegExp(`\\{\\s*"\\$ref"\\s*:\\s*"#/components/schemas/${schemaName}"\\s*\\}`, 'g');
            const replacement = JSON.stringify({ ...inlineSchema, nullable: true });
            schemaText = schemaText.replace(pattern, replacement);
        }

        const schemaObj = JSON.parse(schemaText);
        if (schemaObj.components && schemaObj.components.schemas) {
            // Удаляем все JsonNullable схемы из components.schemas
            Object.keys(schemaObj.components.schemas).forEach(key => {
                if (key.startsWith('JsonNullable')) {
                    delete schemaObj.components.schemas[key];
                }
            });
        }

        fs.writeFileSync(TEMP_PATH, JSON.stringify(schemaObj, null, 2));
        execSync(`npx openapi-typescript ${TEMP_PATH} -o ${OUTPUT_TYPES_PATH}`, { stdio: 'inherit' });
        console.log('Успешная генерация API');
    } catch (error) {
        console.error('Ошибка при генерации API:', error.message);
    } finally {
        if (fs.existsSync(TEMP_PATH)) fs.unlinkSync(TEMP_PATH);
    }
}

generate();