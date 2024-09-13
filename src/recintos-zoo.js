const recintos = [
    { id: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
    { id: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
    { id: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
    { id: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
    { id: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
  ];
  
  const especies = {
    'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
    'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
    'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
    'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
    'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
    'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
  };
  
  class RecintosZoo {
  
    validarEntrada(animal, quantidade) {
      if (!especies[animal]) {
        return { erro: "Animal inválido" };
      }
      if (quantidade <= 0 || isNaN(quantidade)) { 
        return { erro: "Quantidade inválida" };
      }
      return null;
    }
  
    calcularEspacoRestante(recinto, animal, quantidade) {
      let espacoOcupado = recinto.animais.reduce((total, atual) => {
        const infoAnimal = especies[atual.especie];
        return total + (infoAnimal.tamanho * atual.quantidade);
      }, 0);
  
      const especiesPresentes = new Set(recinto.animais.map(atual => atual.especie));
  
      espacoOcupado += especies[animal].tamanho * quantidade;
  
      if (especiesPresentes.size > 0 && !especiesPresentes.has(animal)) {
        espacoOcupado += 1; // Adiciona o espaço extra se houver mais de uma espécie
      }
  
      return recinto.tamanhoTotal - espacoOcupado;
    }
  
    biomaCompativel(recinto, animal, quantidade) {
      const info = especies[animal];
      const biomas = recinto.bioma.split(" e ");
      const compativel = biomas.some(b => info.bioma.includes(b));
  
      if (!compativel) return false;
  
      const espacoRestante = this.calcularEspacoRestante(recinto, animal, quantidade);
      return espacoRestante >= 0;
    }
  
    verificarCarnivoros(recinto, animal) {
      const info = especies[animal];
      if (info.carnivoro) {
        const especiesNoRecinto = new Set(recinto.animais.map(a => a.especie));
        if ([...especiesNoRecinto].some(especie => especie !== animal)) {
          return false;
        }
      } else {
        const especiesNoRecinto = new Set(recinto.animais.map(a => a.especie));
        if ([...especiesNoRecinto].some(especie => especies[especie].carnivoro)) {
          return false;
        }
      }
  
      return true;
    }
  
    verificarHipopotamo(recinto, animal) {
      if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) {
        return false;
      }
      return true;
    }
  
    verificarMacaco(recinto, animal, quantidade) {
      if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
        return false;
      }
      return true;
    }
  
    verificarConforto(recinto, animal, quantidade) {
      const info = especies[animal];
      if (info.carnivoro) {
        const especiesNoRecinto = new Set(recinto.animais.map(a => a.especie));
        if ([...especiesNoRecinto].some(especie => especie !== animal)) {
          return false;
        }
      }
  
      if (recinto.animais.some(a => a.especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio')) {
        return false;
      }
  
      if (recinto.animais.some(a => a.especie === 'MACACO') && animal !== 'MACACO' && quantidade === 1 && recinto.animais.length === 1) {
        return false;
      }
  
      return true;
    }
  
    analisaRecintos(animal, quantidade) {
      const erroEntrada = this.validarEntrada(animal, quantidade);
      if (erroEntrada) {
        return erroEntrada;
      }
  
      const recintosViaveis = recintos.filter(recinto => {
        if (!this.biomaCompativel(recinto, animal, quantidade)) return false;
        if (!this.verificarConforto(recinto, animal, quantidade)) return false;
        if (!this.verificarCarnivoros(recinto, animal)) return false;
        if (!this.verificarHipopotamo(recinto, animal)) return false;
        if (!this.verificarMacaco(recinto, animal, quantidade)) return false;
  
        return true;
      });
  
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      }
  
      recintosViaveis.sort((a, b) => a.id - b.id);
  
      return {
        recintosViaveis: recintosViaveis.map(r => {
          const espacoRestante = this.calcularEspacoRestante(r, animal, quantidade);
          return `Recinto ${r.id} (espaço livre: ${espacoRestante} total: ${r.tamanhoTotal})`;
        })
      };
    }
  }
  
  export { RecintosZoo as RecintosZoo };
  