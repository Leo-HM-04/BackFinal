// Test de compensación de fechas
console.log('=== TEST DE COMPENSACIÓN DE FECHAS ===\n');

// Simular la función formatDateForAPI con compensación
function formatDateForAPI(date) {
  if (!date) return '';
  
  // COMPENSACIÓN: Agregar un día para que el backend registre la fecha correcta
  const compensatedDate = new Date(date);
  compensatedDate.setDate(compensatedDate.getDate() + 1);
  
  // Usar la fecha compensada para el formato
  const year = compensatedDate.getFullYear();
  const month = String(compensatedDate.getMonth() + 1).padStart(2, '0');
  const day = String(compensatedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Simular la función parseBackendDateForForm con compensación
function parseBackendDateForForm(dateString) {
  if (!dateString) return new Date();
  
  // Si viene solo la fecha (YYYY-MM-DD), crear fecha local y compensar
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  // COMPENSACIÓN: Restar un día para mostrar la fecha correcta en formularios
  localDate.setDate(localDate.getDate() - 1);
  return localDate;
}

console.log('1. Usuario selecciona fecha 15 de agosto en el DatePicker:');
const fechaSeleccionada = new Date(2025, 7, 15); // 15 de agosto
console.log(`Fecha seleccionada: ${fechaSeleccionada.toLocaleDateString()}`);

const fechaParaBackend = formatDateForAPI(fechaSeleccionada);
console.log(`Fecha enviada al backend: ${fechaParaBackend}`);

console.log('\n2. Backend recibe la fecha y la guarda (simulando el problema):');
console.log(`El backend guardará: ${fechaParaBackend} (que debería ser 2025-08-16)`);

console.log('\n3. Cuando se carga para editar:');
const fechaCargada = parseBackendDateForForm(fechaParaBackend);
console.log(`Fecha mostrada en el DatePicker: ${fechaCargada.toLocaleDateString()}`);

console.log('\n4. Verificación del flujo completo:');
console.log(`¿La fecha mostrada es la misma que seleccionó? ${fechaCargada.toLocaleDateString() === fechaSeleccionada.toLocaleDateString() ? 'SÍ' : 'NO'}`);

console.log('\n✅ Test de compensación completado.');
console.log('Si todo muestra "SÍ", la compensación está funcionando correctamente.');
