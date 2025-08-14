exports.createDepartamento = (req, res) => {
  // Implementación pendiente
  res.status(501).json({ message: 'No implementado' });
};

exports.updateDepartamento = (req, res) => {
  // Implementación pendiente
  res.status(501).json({ message: 'No implementado' });
};

exports.deleteDepartamento = (req, res) => {
  // Implementación pendiente
  res.status(501).json({ message: 'No implementado' });
};
// Lista de departamentos válidos según la base de datos
const departamentos = [
  'contabilidad',
  'facturacion',
  'cobranza',
  'vinculacion',
  'administracion',
  'ti',
  'automatizaciones',
  'comercial',
  'atencion a clientes',
  'tesoreria',
  'nomina',
  'atraccion de talento'
];

exports.getDepartamentos = (req, res) => {
  res.json({ departamentos });
};
