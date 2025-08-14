// Script para probar fechas
console.log('=== ANÁLISIS DE FECHAS ===\n');

// 1. Simular lo que hace el frontend
console.log('1. FRONTEND - formatDateForAPI():');
const fechaSeleccionada = new Date(2025, 7, 16); // 16 de agosto 2025 (mes 7 = agosto)
console.log(`Fecha seleccionada: ${fechaSeleccionada}`);

function formatDateForAPI(date) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

const fechaParaAPI = formatDateForAPI(fechaSeleccionada);
console.log(`Fecha para API: ${fechaParaAPI}`);

// 2. Simular lo que hace la base de datos
console.log('\n2. BASE DE DATOS - interpretación:');
const fechaEnDB = new Date(fechaParaAPI);
console.log(`new Date("${fechaParaAPI}"): ${fechaEnDB}`);
console.log(`toISOString(): ${fechaEnDB.toISOString()}`);

// 3. Zona horaria del sistema
console.log('\n3. ZONA HORARIA DEL SISTEMA:');
console.log(`Zona horaria offset: ${new Date().getTimezoneOffset()} minutos`);
console.log(`Fecha actual: ${new Date()}`);

// 4. Prueba con diferentes horas
console.log('\n4. PRUEBA CON DIFERENTES HORAS:');
const fechas = [
  '2025-08-16',
  '2025-08-16T00:00:00',
  '2025-08-16T12:00:00',
  '2025-08-16T23:59:59'
];

fechas.forEach(fecha => {
  const d = new Date(fecha);
  console.log(`"${fecha}" -> ${d} -> ISO: ${d.toISOString()}`);
});

// 5. Solución propuesta
console.log('\n5. SOLUCIÓN - FORZAR ZONA HORARIA LOCAL:');
function fixDateForMySQL(dateString) {
  // Crear fecha interpretando en zona horaria local
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  
  console.log(`Fecha original: ${dateString}`);
  console.log(`Fecha local: ${localDate}`);
  console.log(`Formato para MySQL: ${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

fixDateForMySQL('2025-08-16');
