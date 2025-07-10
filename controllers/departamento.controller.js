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
  'nomina'
];

exports.getDepartamentos = (req, res) => {
  res.json({ departamentos });
};
