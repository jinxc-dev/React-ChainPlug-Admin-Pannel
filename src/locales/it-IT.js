import analysis from './it-IT/analysis';
import exception from './it-IT/exception';
import form from './it-IT/form';
import globalHeader from './it-IT/globalHeader';
import login from './it-IT/login';
import menu from './it-IT/menu';
import monitor from './it-IT/monitor';
import result from './it-IT/result';
import settingDrawer from './it-IT/settingDrawer';
import settings from './it-IT/settings';
import pwa from './it-IT/pwa';
import component from './it-IT/component';
import dashboard from './it-IT/dashboard';
import chains from './it-IT/chains';
import certificate from './it-IT/certificate';
import admin from './it-IT/admin';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.home.introduce': 'introduzir',
  'app.forms.basic.title': 'Basic form',
  'app.forms.certificate.title': 'Certificate form',
  'app.forms.approve.title': 'Approve Form',
  'app.forms.approve.request': 'REQUESTED FORM',
  'app.forms.approve.certificate': 'Approve Certificate',
  'app.forms.basic.description':
    'Páginas de formulário são usadas para coletar e verificar as informações dos usuários e formulários básicos são comuns nos cenários onde existem alguns formatos de informações.',
  'app.certificate.introduce': 'my certificate',
  'app.inprogress.introduce': 'my certificate in progress',
  'app.expire.introduce': 'my certificate about to expire',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...chains,
  ...certificate,
  ...dashboard,
  ...admin
};
