export interface IModuleInfo {
  id: string;
  module_name: string;
  domain: string;
  filename: string;
  status: string;
}

export function useOverridesTable() {

  const data = [
    {
      id: 'RandomNumber1',
      module_name: 'single-spa',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'single-spa.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber2',
      module_name: 'single-spa-vue',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'single-spa-vue.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber3',
      module_name: 'axios',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'axios.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber4',
      module_name: 'vue-axios',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vue-axios.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber5',
      module_name: 'vue',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vue.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber6',
      module_name: 'vuetify',
      domain: 'https://cdnjs.cloudflare.com',
      filename: 'vuetify.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber7',
      module_name: 'vuex',
      domain: 'https://cdnjs.cloudflare.com',
      filename: 'vuex.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber8',
      module_name: 'vue-i18n',
      domain: 'https://unpkg.com',
      filename: 'vue-i18n.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber9',
      module_name: 'vue-router',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vue-router.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber10',
      module_name: 'vue-moment',
      domain: 'https://cdnjs.cloudflare.com',
      filename: 'vue-moment.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber11',
      module_name: 'moment',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'moment-with-locales.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber12',
      module_name: 'moment-timezone',
      domain: 'https://cdnjs.cloudflare.com',
      filename: 'moment-timezone.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber13',
      module_name: 'vueperslides',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vueperslides.umd.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber14',
      module_name: 'lodash',
      domain: 'https://cdnjs.cloudflare.com',
      filename: 'lodash.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber15',
      module_name: 'vue-tel-input',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vue-tel-input.umd.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber16',
      module_name: 'rxjs',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'rxjs.min.js',
      status: 'default'
    },
    {
      id: 'RandomNumber17',
      module_name: 'vee-validate',
      domain: 'https://cdn.jsdelivr.net',
      filename: 'vee-validate.min.js',
      status: 'default'
    }
  ]
  return { data }
}