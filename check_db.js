const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'plataforma_solicitudes_pago',
    });

    console.log('Checking table structure...');
    const [rows] = await pool.query('DESCRIBE comprobantes_viaticos');
    console.log('Table structure:', JSON.stringify(rows, null, 2));
    
    console.log('\nChecking if any records exist...');
    const [records] = await pool.query('SELECT * FROM comprobantes_viaticos LIMIT 5');
    console.log('Records:', JSON.stringify(records, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
