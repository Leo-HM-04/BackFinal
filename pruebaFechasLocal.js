console.log('🧪 Prueba de fechas JavaScript');

// Simular lo que hace formatDateForAPI
function formatDateForAPI(date) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Simular lo que hace parseUTC6Date
function parseUTC6Date(dateString) {
  if (!dateString) return new Date();
  
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Simular lo que hace formatDateForDisplay
function formatDateForDisplay(dateString) {
  if (!dateString) return 'N/A';
  
  const date = parseUTC6Date(dateString);
  
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Pruebas
console.log('\n📅 Fecha actual del sistema:');
const today = new Date();
console.log(`   Sistema: ${today.toString()}`);
console.log(`   Local: ${today.toLocaleDateString('es-MX')}`);

console.log('\n🔄 Prueba del flujo completo:');
console.log('1. Usuario selecciona fecha en el frontend (ej: 15 de agosto de 2025)');
const userSelectedDate = new Date(2025, 7, 15); // Agosto = 7 (0-indexed)
console.log(`   Fecha seleccionada: ${userSelectedDate.toLocaleDateString('es-MX')}`);

console.log('\n2. formatDateForAPI convierte para enviar al backend:');
const dateForAPI = formatDateForAPI(userSelectedDate);
console.log(`   Para API: "${dateForAPI}"`);

console.log('\n3. Backend recibe y almacena en MySQL como DATE:');
console.log(`   MySQL almacena: "${dateForAPI}"`);

console.log('\n4. Frontend recibe de vuelta y muestra:');
const displayDate = formatDateForDisplay(dateForAPI);
console.log(`   Mostrar: "${displayDate}"`);

console.log('\n5. Verificación de parseUTC6Date:');
const parsedDate = parseUTC6Date(dateForAPI);
console.log(`   Parsed: ${parsedDate.toLocaleDateString('es-MX')}`);

// Casos edge
console.log('\n⚠️  Casos problemáticos:');

console.log('\nPrueba con fecha que viene de MySQL (simulada):');
const mysqlDate = '2025-08-15'; // Como lo devuelve MySQL
const parsed = parseUTC6Date(mysqlDate);
console.log(`   MySQL devuelve: "${mysqlDate}"`);
console.log(`   Parsed: ${parsed.toLocaleDateString('es-MX')}`);
console.log(`   Display: ${formatDateForDisplay(mysqlDate)}`);

console.log('\nPrueba con fecha ISO (timestamp completo):');
const isoDate = '2025-08-15T12:00:00.000Z';
const parsedISO = parseUTC6Date(isoDate);
console.log(`   ISO: "${isoDate}"`);
console.log(`   Parsed: ${parsedISO.toLocaleDateString('es-MX')}`);
console.log(`   Display: ${formatDateForDisplay(isoDate)}`);

console.log('\n✅ Prueba completada');
