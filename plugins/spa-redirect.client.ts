export default defineNuxtPlugin(() => {
    if (process.client && window.sessionStorage) {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        
        const config = useRuntimeConfig();
        const base = config.app?.baseURL || '/';
        
        let normalizedPath = redirectPath;
        if (base !== '/' && normalizedPath.startsWith(base)) {
          normalizedPath = normalizedPath.substring(base.length) || '/';
        }
  
        const router = useRouter();
        setTimeout(() => {
          router.push(normalizedPath);
        }, 0);
      }
    }
  });