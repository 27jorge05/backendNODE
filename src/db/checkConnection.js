import pool from './connection.js';

try {
    const [rows] = await pool.execute('SELECT 1 AS connection_ok');

    console.log('Conexión MySQL correcta:', rows[0].connection_ok);
} catch (error) {
    console.error(
        'No se pudo conectar con MySQL:',
        error.code ?? 'ERROR_DESCONOCIDO',
    );

    process.exitCode = 1;
} finally {
    await pool.end();
}