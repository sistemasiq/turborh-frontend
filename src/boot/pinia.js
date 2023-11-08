import { createPinia } from 'pinia';

export const pinia = createPinia()

export default ({ app }) => {
    const pinia = createPinia();
    app.use(pinia);
  };