const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'srv1505.hstgr.io',
      user: process.env.DB_USER || 'u995420991_undbechapra',
      password: process.env.DB_PASSWORD || '19042004Leo',
      database: process.env.DB_NAME || 'u995420991_plataformaPago',
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
