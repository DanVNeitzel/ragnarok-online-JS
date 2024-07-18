// Definindo uma função para calcular o nível com base na experiência
function calcularNivel(experiencia) {
  // Tabela de experiência necessária para subir de nível
  const tabelaExperiencia = [
    350, 550, 900, 1500, 2200, 3200, 3800, 4200, 4550, 5000,
    5500, 6000, 6100, 6350, 6700, 7350, 8000, 8400, 8800, 9200,
    9700, 10300, 11000, 11800, 13000, 14000, 15000, 16000, 17000, 18000,
    19000, 20000, 21000, 22000, 23200, 24000, 26000, 27500, 29000, 30000,
    31500, 33000, 34000, 36000, 37500, 38000, 40000, 42000, 44500, 47000,
    49000, 51000, 53000, 55000, 57000, 59000, 61500, 63000, 65000, 67000,
    69000, 70000, 73000, 77000, 80000, 84000, 88000, 91000, 95000, 110000,
    128000, 140000, 155000, 163000, 170000, 180000, 188000, 195000, 200000,
    230000, 260000, 300000, 350000, 400000, 480000, 550000, 600000, 680000,
    750000, 900000, 1000000, 1200000, 1500000, 1800000, 2100000, 2400000,
    2800000, 3300000, 4000000
  ];

  // Iterando pela tabela de experiência para encontrar o nível
  let nivel = 1;
  for (let i = 0; i < tabelaExperiencia.length; i++) {
    if (experiencia >= tabelaExperiencia[i]) {
      nivel = i + 2;
    } else {
      break;
    }
  }

  return nivel;
}

// Exemplo de uso
const experiencia = 6000;
const nivel = calcularNivel(experiencia);
console.log(`O personagem está no nível ${nivel}.`);
