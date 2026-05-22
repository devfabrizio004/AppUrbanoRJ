import AsyncStorage from '@react-native-async-storage/async-storage';

// chave usada pra salvar tudo no storage
const REPORTS_KEY = '@urbanorj_reports';

// gera um id unico pra cada registro
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// busca todos os registros salvos
export async function getAllReports() {
  try {
    const json = await AsyncStorage.getItem(REPORTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('erro ao buscar registros:', e);
    return [];
  }
}

// busca um registro pelo id
export async function getReportById(id) {
  const reports = await getAllReports();
  return reports.find((r) => r.id === id) || null;
}

// cria um novo registro
export async function createReport(data) {
  try {
    const reports = await getAllReports();
    const newReport = {
      id: generateId(),
      titulo: data.titulo || '',
      descricao: data.descricao || '',
      categoria: data.categoria || 'outros',
      status: 'aberto',
      endereco: data.endereco || '',
      bairro: data.bairro || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      foto: data.foto || null,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      votos: 0,
    };
    // coloca o novo no inicio da lista
    const updated = [newReport, ...reports];
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    return newReport;
  } catch (e) {
    console.error('erro ao criar registro:', e);
    return null;
  }
}

// atualiza campos de um registro existente
export async function updateReport(id, data) {
  try {
    const reports = await getAllReports();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    reports[idx] = {
      ...reports[idx],
      ...data,
      atualizadoEm: new Date().toISOString(),
    };
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return reports[idx];
  } catch (e) {
    console.error('erro ao atualizar registro:', e);
    return null;
  }
}

// deleta um registro pelo id
export async function deleteReport(id) {
  try {
    const reports = await getAllReports();
    const updated = reports.filter((r) => r.id !== id);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('erro ao deletar registro:', e);
    return false;
  }
}

// adiciona um voto de confirmacao no problema
export async function upvoteReport(id) {
  try {
    const reports = await getAllReports();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    reports[idx].votos = (reports[idx].votos || 0) + 1;
    reports[idx].atualizadoEm = new Date().toISOString();
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return reports[idx];
  } catch (e) {
    console.error('erro ao votar:', e);
    return null;
  }
}

// calcula estatisticas gerais pro painel
export async function getStats() {
  const reports = await getAllReports();
  const total = reports.length;
  const abertos = reports.filter((r) => r.status === 'aberto').length;
  const em_andamento = reports.filter((r) => r.status === 'em_andamento').length;
  const resolvidos = reports.filter((r) => r.status === 'resolvido').length;

  const porCategoria = {};
  reports.forEach((r) => {
    porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + 1;
  });

  return { total, abertos, em_andamento, resolvidos, porCategoria };
}

// carrega exemplos pra nao ficar vazio na primeira vez que abrir
export async function seedDemoData() {
  const existing = await getAllReports();
  if (existing.length > 0) return; // ja tem dados, nao precisa adicionar

  const demos = [
    {
      titulo: 'Buraco enorme na Rua da Carioca',
      descricao: 'Cratera no meio da rua, já furou pneu de moto. Tá lá há mais de um mês e ninguém faz nada.',
      categoria: 'buraco',
      status: 'aberto',
      endereco: 'Rua da Carioca, 120',
      bairro: 'Centro',
      latitude: -22.9068,
      longitude: -43.1729,
      votos: 14,
    },
    {
      titulo: 'Poste apagado na Visconde de Pirajá',
      descricao: 'Três semanas sem luz nesse trecho. Já aconteceu assalto aqui essa semana por causa da escuridão.',
      categoria: 'iluminacao',
      status: 'em_andamento',
      endereco: 'Av. Visconde de Pirajá, 550',
      bairro: 'Ipanema',
      latitude: -22.9847,
      longitude: -43.2036,
      votos: 23,
    },
    {
      titulo: 'Terreno baldio cheio de água parada – dengue',
      descricao: 'Terreno abandonado com pneus velhos e lona acumulando água. Mosquito demais por aqui, dois casos de dengue no prédio vizinho.',
      categoria: 'dengue',
      status: 'aberto',
      endereco: 'Rua Bambina, 34',
      bairro: 'Botafogo',
      latitude: -22.9533,
      longitude: -43.1852,
      votos: 31,
    },
    {
      titulo: 'Esgoto estourando na calçada',
      descricao: 'Cheiro insuportável e risco de doença. Crianças passam por aqui pra ir pra escola toda manhã.',
      categoria: 'saneamento',
      status: 'aberto',
      endereco: 'Rua Conde de Bonfim, 410',
      bairro: 'Tijuca',
      latitude: -22.9291,
      longitude: -43.2365,
      votos: 8,
    },
    {
      titulo: 'Calçada destruída – idosos não conseguem passar',
      descricao: 'Pedras levantadas e buracos. Uma señora caiu semana passada. Precisava de rampa e tá um perigo.',
      categoria: 'calcada',
      status: 'resolvido',
      endereco: 'Rua Voluntários da Pátria, 200',
      bairro: 'Botafogo',
      latitude: -22.9382,
      longitude: -43.1765,
      votos: 17,
    },
  ];

  for (const demo of demos) {
    await createReport(demo);
  }
}
