import 'dotenv/config';
import { IParametrosConfiguracao } from '../../../src/types';

const config: IParametrosConfiguracao = {
  ip: process.env.SITEF_IP || '192.168.1.28',
  loja: process.env.SITEF_LOJA || '00000000',
  terminal: process.env.SITEF_TERMINAL || '00000000',
  reservado: process.env.SITEF_RESERVADO || '',
};

export default config;
