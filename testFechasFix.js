// Test para verificar que el procesamiento de fechas funciona correctamente
console.log('=== TEST DE PROCESAMIENTO DE FECHAS ===\n');

function procesarFechaLimite(fecha_limite_pago) {
  let fechaLimiteProcesada = fecha_limite_pago;
  if (fecha_limite_pago) {
    // Asegurar que la fecha se trate como fecha local, no UTC
    const [year, month, day] = fecha_limite_pago.split('-').map(Number);
    const fechaLocal = new Date(year, month - 1, day);
    fechaLimiteProcesada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    console.log(`Fecha original: ${fecha_limite_pago}`);
    console.log(`Fecha procesada: ${fechaLimiteProcesada}`);
    console.log(`Fecha como objeto: ${fechaLocal}`);
    console.log(`Día de la semana: ${fechaLocal.toLocaleDateString('es-MX', { weekday: 'long' })}`);
    console.log('---');
  }
  return fechaLimiteProcesada;
}

// Pruebas
console.log('1. Prueba con fecha de hoy + 2 días:');
procesarFechaLimite('2025-08-16');

console.log('\n2. Prueba con fecha de próximo mes:');
procesarFechaLimite('2025-09-15');

console.log('\n3. Prueba con fecha de fin de año:');
procesarFechaLimite('2025-12-31');

console.log('\n4. Comparación con new Date() directo:');
const fechaProblematica = '2025-08-16';
console.log(`new Date("${fechaProblematica}"):`, new Date(fechaProblematica));

const [year, month, day] = fechaProblematica.split('-').map(Number);
const fechaCorrecta = new Date(year, month - 1, day);
console.log(`new Date(${year}, ${month-1}, ${day}):`, fechaCorrecta);

console.log('\n✅ Test completado. Si las fechas se ven correctas, el fix está funcionando.');
